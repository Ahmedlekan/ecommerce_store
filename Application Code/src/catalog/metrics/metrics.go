// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

package metrics

import (
	"strconv"
	"time"

	"github.com/prometheus/client_golang/prometheus"
)

var catalogRequests = prometheus.NewCounterVec(
	prometheus.CounterOpts{
		Name: "catalog_requests_total",
		Help: "Total catalog API requests",
	},
	[]string{"operation", "method", "status"},
)

var catalogSearches = prometheus.NewCounterVec(
	prometheus.CounterOpts{
		Name: "catalog_search_total",
		Help: "Total catalog product search/list requests",
	},
	[]string{"has_tags"},
)

var catalogDuration = prometheus.NewHistogramVec(
	prometheus.HistogramOpts{
		Name:    "catalog_duration_seconds",
		Help:    "Catalog API request duration in seconds",
		Buckets: []float64{0.05, 0.1, 0.25, 0.5, 1, 2, 5},
	},
	[]string{"operation", "method", "status"},
)

func init() {
	prometheus.MustRegister(catalogRequests)
	prometheus.MustRegister(catalogSearches)
	prometheus.MustRegister(catalogDuration)
}

func RecordRequest(operation string, method string, start time.Time, status string) {
	catalogRequests.WithLabelValues(operation, method, status).Inc()
	catalogDuration.WithLabelValues(operation, method, status).Observe(time.Since(start).Seconds())
}

func RecordSearch(hasTags bool) {
	catalogSearches.WithLabelValues(strconv.FormatBool(hasTags)).Inc()
}
