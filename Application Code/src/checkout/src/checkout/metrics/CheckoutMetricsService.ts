/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { Injectable } from '@nestjs/common';
import { Counter, Histogram, register } from 'prom-client';

@Injectable()
export class CheckoutMetricsService {
  private static readonly ENDPOINT = 'checkout_submit';

  private readonly requests: Counter<string>;
  private readonly success: Counter<string>;
  private readonly errors: Counter<string>;
  private readonly duration: Histogram<string>;

  constructor() {
    this.requests = this.getOrCreateCounter(
      'checkout_requests_total',
      'Total checkout submit attempts',
      ['endpoint'],
    );
    this.success = this.getOrCreateCounter(
      'checkout_success_total',
      'Successful checkout submissions',
      ['endpoint'],
    );
    this.errors = this.getOrCreateCounter(
      'checkout_errors_total',
      'Failed checkout submissions',
      ['endpoint', 'error_type'],
    );
    this.duration = this.getOrCreateHistogram(
      'checkout_submit_duration_seconds',
      'Checkout submit duration in seconds',
      ['endpoint', 'status'],
      [0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10],
    );
  }

  recordRequest(): void {
    this.requests.inc({ endpoint: CheckoutMetricsService.ENDPOINT });
  }

  recordSuccess(): void {
    this.success.inc({ endpoint: CheckoutMetricsService.ENDPOINT });
  }

  recordError(error: unknown): void {
    this.errors.inc({
      endpoint: CheckoutMetricsService.ENDPOINT,
      error_type: this.getErrorType(error),
    });
  }

  startSubmitTimer(): (status: 'success' | 'error') => void {
    const endTimer = this.duration.startTimer();

    return (status: 'success' | 'error') => {
      endTimer({
        endpoint: CheckoutMetricsService.ENDPOINT,
        status,
      });
    };
  }

  private getOrCreateCounter(
    name: string,
    help: string,
    labelNames: string[],
  ): Counter<string> {
    const existingMetric = register.getSingleMetric(name);

    if (existingMetric) {
      return existingMetric as Counter<string>;
    }

    return new Counter({
      name,
      help,
      labelNames,
    });
  }

  private getOrCreateHistogram(
    name: string,
    help: string,
    labelNames: string[],
    buckets: number[],
  ): Histogram<string> {
    const existingMetric = register.getSingleMetric(name);

    if (existingMetric) {
      return existingMetric as Histogram<string>;
    }

    return new Histogram({
      name,
      help,
      labelNames,
      buckets,
    });
  }

  private getErrorType(error: unknown): string {
    if (error instanceof Error) {
      return error.constructor.name;
    }

    return 'unknown';
  }
}
