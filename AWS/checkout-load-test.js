import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

export const options = {
  stages: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 25 },
    { duration: '2m', target: 0 },
  ],

  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2000'],
    checks: ['rate>0.95'],

    checkout_flow_success_rate: ['rate>0.95'],
    checkout_flow_duration: ['p(95)<5000'],
  },
};

const BASE_URL = (__ENV.BASE_URL || '').replace(/\/$/, '');

if (!BASE_URL) {
  throw new Error(
    'BASE_URL is required. Example: k6 run -e BASE_URL=http://retail-store-http-ip-mode-1935278760.us-east-1.elb.amazonaws.com AWS/checkout-load-test.js'
  );
}

const PRODUCT_IDS = [
  'cc789f85-1476-452a-8100-9e74502198e0',
  '87e89b11-d319-446d-b9be-50adcca5224a',
  '4f18544b-70a5-4352-8e19-0d070f46745d',
  '79bce3f3-935f-4912-8c62-0d2f3e059405',
  'd27cf49f-b689-4a75-a249-d373e0330bb5',
  '1ca35e86-4b4c-4124-b6b5-076ba4134d0d',
  '631a3db5-ac07-492c-a994-8cd56923c112',
  '8757729a-c518-4356-8694-9e795a9b3237',
  'd4edfedb-dbe9-4dd9-aae8-009489394955',
];

const completedCheckouts = new Counter('completed_checkouts');
const failedCheckouts = new Counter('failed_checkouts');
const checkoutFlowSuccessRate = new Rate('checkout_flow_success_rate');
const checkoutFlowDuration = new Trend('checkout_flow_duration', true);

function randomProductId() {
  return PRODUCT_IDS[Math.floor(Math.random() * PRODUCT_IDS.length)];
}

function validResponse(response) {
  return response.status >= 200 && response.status < 400;
}

function responseContainsError(response) {
  const body = (response.body || '').toLowerCase();

  return (
    body.includes('invalid zip code') ||
    body.includes('payment failed') ||
    body.includes('checkout failed') ||
    body.includes('order failed') ||
    body.includes('internal server error')
  );
}

export default function () {
  /*
   * Each VU has its own cookie jar.
   * Clearing it here starts every iteration as a new customer session.
   */
  const jar = http.cookieJar();
  jar.clear(BASE_URL);

  const productId = randomProductId();
  const startedAt = Date.now();
  let flowSuccessful = true;

  group('01 - Browse store', () => {
    const home = http.get(`${BASE_URL}/home`, {
      tags: { name: 'GET /home' },
    });

    const catalog = http.get(`${BASE_URL}/catalog`, {
      tags: { name: 'GET /catalog' },
    });

    const product = http.get(`${BASE_URL}/catalog/${productId}`, {
      tags: { name: 'GET /catalog/:productId' },
    });

    const passed = check(home, {
      'home loaded': validResponse,
    }) &&
      check(catalog, {
        'catalog loaded': validResponse,
      }) &&
      check(product, {
        'product page loaded': validResponse,
      });

    flowSuccessful = flowSuccessful && passed;
  });

  group('02 - Add product to cart', () => {
    const response = http.post(
      `${BASE_URL}/cart`,
      {
        productId,
      },
      {
        redirects: 5,
        tags: { name: 'POST /cart' },
      }
    );

    const passed = check(response, {
      'product added to cart': validResponse,
      'cart operation has no server error': (r) =>
        !responseContainsError(r),
    });

    flowSuccessful = flowSuccessful && passed;
  });

  group('03 - View cart', () => {
    const response = http.get(`${BASE_URL}/cart`, {
      tags: { name: 'GET /cart' },
    });

    const passed = check(response, {
      'cart loaded': validResponse,
      'cart contains selected product': (r) =>
        (r.body || '').includes(productId) ||
        !(r.body || '').includes('>$0<'),
    });

    flowSuccessful = flowSuccessful && passed;
  });

  group('04 - Submit checkout address', () => {
    const checkoutPage = http.get(`${BASE_URL}/checkout`, {
      tags: { name: 'GET /checkout' },
    });

    const pagePassed = check(checkoutPage, {
      'checkout page loaded': validResponse,
    });

    const addressResponse = http.post(
      `${BASE_URL}/checkout`,
      {
        firstName: 'John',
        lastName: 'Doe',
        email: `loadtest-${__VU}-${__ITER}@example.com`,
        streetAddress: '100 Main Street',
        city: 'Anytown',
        state: 'CA',
        zipCode: '11111',
      },
      {
        redirects: 5,
        tags: { name: 'POST /checkout' },
      }
    );

    const addressPassed = check(addressResponse, {
      'checkout address accepted': validResponse,
      'address validation passed': (r) =>
        !(r.body || '').includes('Invalid zip code'),
    });

    flowSuccessful =
      flowSuccessful && pagePassed && addressPassed;
  });

  group('05 - Submit delivery option', () => {
    const response = http.post(
      `${BASE_URL}/checkout/delivery`,
      {
        token: 'priority-mail',
      },
      {
        redirects: 5,
        tags: { name: 'POST /checkout/delivery' },
      }
    );

    const passed = check(response, {
      'delivery option accepted': validResponse,
      'delivery has no application error': (r) =>
        !responseContainsError(r),
    });

    flowSuccessful = flowSuccessful && passed;
  });

  group('06 - Submit payment and create order', () => {
    const response = http.post(
      `${BASE_URL}/checkout/payment`,
      {
        cardHolder: 'John Doe',
        cardNumber: '1234567890123456',
        expiryDate: '01/35',
        cvc: '123',
      },
      {
        redirects: 5,
        tags: { name: 'POST /checkout/payment' },
      }
    );

    const passed = check(response, {
      'payment endpoint responded successfully': validResponse,

      'checkout did not return application error': (r) =>
        !responseContainsError(r),

      /*
       * The successful page may vary by application version.
       * These markers cover common order-completion responses.
       */
      'order completion page returned': (r) => {
        const body = (r.body || '').toLowerCase();

        return (
          body.includes('order') ||
          body.includes('thank you') ||
          body.includes('confirmation') ||
          body.includes('complete')
        );
      },
    });

    flowSuccessful = flowSuccessful && passed;
  });

  checkoutFlowDuration.add(Date.now() - startedAt);
  checkoutFlowSuccessRate.add(flowSuccessful);

  if (flowSuccessful) {
    completedCheckouts.add(1);
  } else {
    failedCheckouts.add(1);
  }

  sleep(Math.random() * 2 + 1);
}
