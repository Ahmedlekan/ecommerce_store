/*
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

package com.amazon.sample.orders.metrics;

import com.amazon.sample.orders.entities.OrderEntity;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import java.util.function.Supplier;
import org.springframework.stereotype.Component;

@Component
public class OrdersSreMetrics {

  private static final String ENDPOINT = "orders_create";

  private final Counter requests;
  private final Counter success;
  private final Counter ordersCreated;
  private final MeterRegistry meterRegistry;

  public OrdersSreMetrics(MeterRegistry meterRegistry) {
    this.meterRegistry = meterRegistry;

    this.requests = Counter.builder("orders.requests")
      .description("Total order create attempts")
      .tag("endpoint", ENDPOINT)
      .register(meterRegistry);

    this.success = Counter.builder("orders.success")
      .description("Successful order create operations")
      .tag("endpoint", ENDPOINT)
      .register(meterRegistry);

    this.ordersCreated = Counter.builder("orders.created")
      .description("Total orders created")
      .tag("endpoint", ENDPOINT)
      .register(meterRegistry);
  }

  public OrderEntity recordCreate(Supplier<OrderEntity> action) {
    requests.increment();

    Timer.Sample sample = Timer.start(meterRegistry);

    try {
      OrderEntity order = action.get();

      success.increment();
      ordersCreated.increment();
      recordDuration(sample, "success");

      return order;
    } catch (RuntimeException e) {
      Counter.builder("orders.errors")
        .description("Failed order create operations")
        .tag("endpoint", ENDPOINT)
        .tag("error_type", e.getClass().getSimpleName())
        .register(meterRegistry)
        .increment();

      recordDuration(sample, "error");

      throw e;
    }
  }

  private void recordDuration(Timer.Sample sample, String status) {
    sample.stop(
      Timer.builder("orders.create.duration")
        .description("Order create duration")
        .tag("endpoint", ENDPOINT)
        .tag("status", status)
        .publishPercentileHistogram()
        .register(meterRegistry)
    );
  }
}
