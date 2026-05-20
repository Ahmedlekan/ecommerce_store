# Platform Stack

This stack owns shared EKS infrastructure only.

Included here:

- EKS cluster
- node groups
- shared providers
- Pod Identity agent add-on
- load balancer controller
- EBS CSI add-on
- Secrets Store CSI driver and AWS provider

Not active here:

- app-specific `catalog` and `orders` secret Pod Identity resources

Those old files were moved into `legacy_app_identity/` so they are preserved but not mixed with the active platform stack.

