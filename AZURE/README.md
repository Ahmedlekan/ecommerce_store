# Azure Project Area

This folder contains the Azure-specific project structure for the ecommerce
platform.

The application source code remains shared at the repository root in
`Application Code/`. Azure-specific infrastructure, AKS manifests,
observability configuration, and workflow templates should live here.

```text
AZURE/
  Terraform/
    shared/
    aks/
      cluster-and-addons/
      app-dataplane/

  Kubernetes_manifest/
    azure_dataplane_k8manifest/
      00_namespace/
      01_catalog/
      02_cart/
      03_checkout/
      04_orders/
      05_ui/
      06_ingress/

  Observability/
    Azure_Monitor_Prometheus/
    Azure_Managed_Grafana/
    Azure_Log_Analytics/

  GitHub_Actions/
```
