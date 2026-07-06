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

package com.amazon.sample.carts.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import java.util.function.Supplier;
import org.springframework.stereotype.Component;

@Component
public class CartSreMetrics {

  private final Counter itemsAdded;
  private final Counter itemsRemoved;
  private final MeterRegistry meterRegistry;

  public CartSreMetrics(MeterRegistry meterRegistry) {
    this.meterRegistry = meterRegistry;
    this.itemsAdded = Counter.builder("cart.items.added")
      .description("Total cart items added")
      .tag("operation", "add_item")
      .register(meterRegistry);
    this.itemsRemoved = Counter.builder("cart.items.removed")
      .description("Total cart items removed")
      .tag("operation", "remove_item")
      .register(meterRegistry);
  }

  public <T> T recordRequest(
    String operation,
    String method,
    Supplier<T> action
  ) {
    Timer.Sample sample = Timer.start(meterRegistry);

    try {
      T result = action.get();
      recordRequestCounter(operation, method, "success");
      recordDuration(sample, operation, method, "success");
      return result;
    } catch (RuntimeException e) {
      recordRequestCounter(operation, method, "error");
      recordDuration(sample, operation, method, "error");
      throw e;
    }
  }

  public void recordRequest(
    String operation,
    String method,
    Runnable action
  ) {
    recordRequest(
      operation,
      method,
      () -> {
        action.run();
        return null;
      }
    );
  }

  public void recordItemsAdded(int quantity) {
    if (quantity <= 0) {
      return;
    }

    itemsAdded.increment(quantity);
  }

  public void recordItemRemoved() {
    itemsRemoved.increment();
  }

  private void recordRequestCounter(
    String operation,
    String method,
    String status
  ) {
    Counter.builder("cart.requests")
      .description("Total cart API requests")
      .tags("operation", operation, "method", method, "status", status)
      .register(meterRegistry)
      .increment();
  }

  private void recordDuration(
    Timer.Sample sample,
    String operation,
    String method,
    String status
  ) {
    sample.stop(
      Timer.builder("cart.duration")
        .description("Cart API request duration")
        .tags("operation", operation, "method", method, "status", status)
        .publishPercentileHistogram()
        .register(meterRegistry)
    );
  }
}
