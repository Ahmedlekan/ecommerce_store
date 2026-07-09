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

package com.amazon.sample.ui.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import java.util.concurrent.TimeUnit;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
public class UiMetricsFilter implements WebFilter {

  private static final String REQUESTS_METRIC = "ui.requests";
  private static final String ERRORS_METRIC = "ui.errors";
  private static final String DURATION_METRIC = "ui.request.duration";
  private static final String REQUEST_ERROR_ATTRIBUTE = "ui.metrics.error";

  private final MeterRegistry meterRegistry;

  public UiMetricsFilter(MeterRegistry meterRegistry) {
    this.meterRegistry = meterRegistry;
  }

  @Override
  public Mono<Void> filter(
    ServerWebExchange exchange,
    WebFilterChain chain
  ) {
    String path = exchange.getRequest().getPath().value();

    if (shouldSkip(path)) {
      return chain.filter(exchange);
    }

    long start = System.nanoTime();

    return chain.filter(exchange)
      .doOnError(error ->
        exchange.getAttributes().put(REQUEST_ERROR_ATTRIBUTE, true)
      )
      .doFinally(signalType -> recordMetrics(exchange, path, start));
  }

  private void recordMetrics(
    ServerWebExchange exchange,
    String path,
    long start
  ) {
    String method = getMethod(exchange);
    String route = normalizeRoute(path);
    String status = getStatus(exchange);

    Counter.builder(REQUESTS_METRIC)
      .description("Total UI HTTP requests")
      .tags("method", method, "route", route, "status", status)
      .register(meterRegistry)
      .increment();

    Timer.builder(DURATION_METRIC)
      .description("UI HTTP request duration")
      .tags("method", method, "route", route, "status", status)
      .publishPercentileHistogram()
      .register(meterRegistry)
      .record(System.nanoTime() - start, TimeUnit.NANOSECONDS);

    if (status.startsWith("5")) {
      Counter.builder(ERRORS_METRIC)
        .description("Total UI HTTP 5xx errors")
        .tags("method", method, "route", route, "status", status)
        .register(meterRegistry)
        .increment();
    }
  }

  private String getMethod(ServerWebExchange exchange) {
    HttpMethod method = exchange.getRequest().getMethod();
    return method == null ? "UNKNOWN" : method.name();
  }

  private String getStatus(ServerWebExchange exchange) {
    HttpStatusCode status = exchange.getResponse().getStatusCode();

    if (status == null) {
      boolean hasError = exchange
        .getAttributes()
        .containsKey(REQUEST_ERROR_ATTRIBUTE);
      return hasError ? "500" : "UNKNOWN";
    }

    return String.valueOf(status.value());
  }

  private boolean shouldSkip(String path) {
    return path.startsWith("/actuator") ||
    path.startsWith("/assets") ||
    path.startsWith("/css") ||
    path.startsWith("/js") ||
    path.startsWith("/img") ||
    path.equals("/favicon.ico");
  }

  private String normalizeRoute(String path) {
    if (path == null || path.isBlank() || path.equals("/")) {
      return "/";
    }

    if (path.startsWith("/catalog/")) {
      return "/catalog/{id}";
    }

    if (path.startsWith("/proxy/catalog/")) {
      return "/proxy/catalog/**";
    }

    if (path.startsWith("/proxy/carts/")) {
      return "/proxy/carts/**";
    }

    if (path.startsWith("/proxy/checkout/")) {
      return "/proxy/checkout/**";
    }

    if (path.startsWith("/proxy/orders/")) {
      return "/proxy/orders/**";
    }

    return path;
  }
}
