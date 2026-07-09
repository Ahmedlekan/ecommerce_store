{{/* Common naming helpers keep resource names predictable across environments. */}}
{{- define "catalog.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/* Fullname supports release-based naming while allowing explicit overrides. */}}
{{- define "catalog.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/* Chart label combines chart name and version. */}}
{{- define "catalog.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/* Common labels are reused on every resource. */}}
{{- define "catalog.labels" -}}
helm.sh/chart: {{ include "catalog.chart" . }}
{{ include "catalog.selectorLabels" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: ecommerce-store
app.kubernetes.io/environment: {{ .Values.environment.name | quote }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
{{- end -}}

{{/* Selector labels for the catalog app resources. */}}
{{- define "catalog.selectorLabels" -}}
app.kubernetes.io/name: {{ include "catalog.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: service
app.kubernetes.io/owner: retail-store-sample
{{- end -}}

{{/* Selector labels for the optional MySQL resources. */}}
{{- define "catalog.mysqlSelectorLabels" -}}
app.kubernetes.io/name: {{ include "catalog.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: mysql
app.kubernetes.io/owner: retail-store-sample
{{- end -}}

{{/* Service account name for the catalog app. */}}
{{- define "catalog.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
{{- default (include "catalog.fullname" .) .Values.serviceAccount.name -}}
{{- else -}}
{{- default "default" .Values.serviceAccount.name -}}
{{- end -}}
{{- end -}}

{{/* Service account name for the optional MySQL pod. */}}
{{- define "catalog.mysqlServiceAccountName" -}}
{{- if .Values.mysql.serviceAccount.create -}}
{{- default (printf "%s-mysql-sa" (include "catalog.fullname" .)) .Values.mysql.serviceAccount.name -}}
{{- else -}}
{{- default "default" .Values.mysql.serviceAccount.name -}}
{{- end -}}
{{- end -}}

{{/* ConfigMap name is configurable so teams can share or externalize config if needed. */}}
{{- define "catalog.configMapName" -}}
{{- default (include "catalog.fullname" .) .Values.configMap.name -}}
{{- end -}}

{{/* SecretProviderClass name is configurable for reuse across multiple workloads. */}}
{{- define "catalog.secretProviderClassName" -}}
{{- .Values.secretStore.providerClass.name -}}
{{- end -}}

{{/* Optional MySQL service name used by the app when mysql.enabled is true. */}}
{{- define "catalog.mysqlFullname" -}}
{{- printf "%s-mysql" (include "catalog.fullname" .) -}}
{{- end -}}

{{/* The catalog endpoint resolves either to in-cluster MySQL or to an external endpoint. */}}
{{- define "catalog.persistenceEndpoint" -}}
{{- if .Values.mysql.enabled -}}
{{ include "catalog.mysqlFullname" . }}:{{ .Values.mysql.service.port }}
{{- else -}}
{{- .Values.configMap.externalEndpoint -}}
{{- end -}}
{{- end -}}

{{/* Merge static and monitoring annotations without forcing ServiceMonitor adoption. */}}
{{- define "catalog.podAnnotations" -}}
{{- $annotations := dict -}}
{{- if .Values.monitoring.enabled -}}
{{- $annotations = merge $annotations .Values.monitoring.podAnnotations -}}
{{- end -}}
{{- if .Values.podAnnotations -}}
{{- $annotations = merge $annotations .Values.podAnnotations -}}
{{- end -}}
{{- if $annotations -}}
{{ toYaml $annotations }}
{{- end -}}
{{- end -}}
