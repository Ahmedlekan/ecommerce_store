# --------------------------------------------------------------------
# ArgoCD Installation for the AWS Dataplane EKS Cluster
# --------------------------------------------------------------------
# Terraform installs ArgoCD as a platform add-on.
# ArgoCD then owns application deployment from Git using the manifests in:
# Kubernetes_manifest/aws_dataplane_k8manifest
# --------------------------------------------------------------------

resource "kubernetes_namespace_v1" "argocd" {
  metadata {
    name = "argocd"
  }
}

resource "helm_release" "argocd" {
  name       = "argocd"
  namespace  = kubernetes_namespace_v1.argocd.metadata[0].name
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  version    = "7.8.2"

  # Keep the ArgoCD server internal by default.
  # Access can be done with kubectl port-forward, or exposed later with an Ingress if needed.
  values = [
    yamlencode({
      server = {
        service = {
          type = "ClusterIP"
        }
      }
    })
  ]

  depends_on = [
    kubernetes_namespace_v1.argocd
  ]
}

output "argocd_namespace" {
  description = "Namespace where ArgoCD is installed"
  value       = kubernetes_namespace_v1.argocd.metadata[0].name
}

output "argocd_helm_release_metadata" {
  description = "ArgoCD Helm release metadata"
  value       = helm_release.argocd.metadata
}
