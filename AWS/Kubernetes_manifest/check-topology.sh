#!/bin/bash

# CHANGE: Fail fast on command errors and unset variables so script problems are visible immediately.
set -o errexit
set -o nounset
set -o pipefail

# CHANGE: Added a namespace variable so the script checks the application namespace instead of default.
NAMESPACE="${NAMESPACE:-micro-tier}"

# CHANGE: Replaced broken encoded box/emoji characters with ASCII for reliable Git Bash/MobaXterm output.
echo "========================================================================"
echo "                  POD TOPOLOGY DISTRIBUTION REPORT"
echo "========================================================================"
echo "Namespace: $NAMESPACE"
echo ""

# CHANGE: Removed jq dependency check by rewriting the script to use kubectl jsonpath/custom-columns.
# This keeps the script portable on machines where jq is not installed.
if ! command -v kubectl >/dev/null 2>&1; then
  echo "ERROR: kubectl is not installed or not available in PATH."
  exit 1
fi

# CHANGE: Keep temporary files for node-zone and pod data so lookup logic stays simple and jq-free.
NODES_FILE=$(mktemp)
PODS_FILE=$(mktemp)

# CHANGE: Added cleanup trap so temporary files are removed even if the script fails midway.
cleanup() {
  rm -f "$NODES_FILE" "$PODS_FILE"
}
trap cleanup EXIT

# CHANGE: Store node-to-zone mapping once to avoid repeated kubectl calls.
kubectl get nodes \
  -o custom-columns=NAME:.metadata.name,ZONE:.metadata.labels.topology\\.kubernetes\\.io/zone \
  --no-headers > "$NODES_FILE"

echo "NODES AND THEIR ZONES:"
echo "------------------------------------------------------------------------"
printf "%-40s %s\n" "NODE" "ZONE"
echo "------------------------------------------------------------------------"
awk '{printf "%-40s %s\n", $1, $2}' "$NODES_FILE" | sort
echo ""

echo "PODS DISTRIBUTION BY APPLICATION:"
echo "------------------------------------------------------------------------"
printf "%-12s %-40s %-40s %s\n" "APP" "POD" "NODE" "ZONE"
echo "------------------------------------------------------------------------"

# CHANGE: Function now handles empty node names so Pending pods are reported cleanly.
get_zone() {
  local node="${1:-}"

  if [ -z "$node" ] || [ "$node" = "<none>" ]; then
    echo "<pending>"
    return
  fi

  local zone
  zone=$(awk -v node="$node" '$1 == node {print $2}' "$NODES_FILE")

  if [ -z "$zone" ]; then
    echo "<unknown>"
  else
    echo "$zone"
  fi
}

# CHANGE: Replaced jq parsing with kubectl custom-columns scoped to the configured namespace.
kubectl get pods -n "$NAMESPACE" \
  -o custom-columns=APP:.metadata.labels.app\\.kubernetes\\.io/name,POD:.metadata.name,NODE:.spec.nodeName \
  --no-headers > "$PODS_FILE"

# CHANGE: Added a guard for namespaces with no pods.
if [ ! -s "$PODS_FILE" ]; then
  echo "No pods found in namespace: $NAMESPACE"
else
  while read -r app pod node; do
    app="${app:-unknown}"
    pod="${pod:-unknown}"
    node="${node:-<none>}"
    zone=$(get_zone "$node")
    printf "%-12s %-40s %-40s %s\n" "$app" "$pod" "$node" "$zone"
  done < "$PODS_FILE" | sort
fi

echo ""
echo "ZONE DISTRIBUTION SUMMARY:"
echo "------------------------------------------------------------------------"

# CHANGE: Build the app list from the local pod file instead of kubectl jsonpath.
APPS=$(awk '{print $1}' "$PODS_FILE" | grep -v '^<none>$' | sort -u || true)

# CHANGE: Added a guard so the summary does not fail when no application labels are found.
if [ -z "$APPS" ]; then
  echo "No app.kubernetes.io/name labels found in namespace: $NAMESPACE"
else
  for app in $APPS; do
    echo ""
    echo "$app:"

    for zone in us-east-1a us-east-1b us-east-1c; do
      # CHANGE: Count pods from local pod data instead of using jq.
      count=$(
        awk -v app="$app" '$1 == app {print $3}' "$PODS_FILE" |
          while read -r node; do
            get_zone "$node"
          done |
          grep -c "^$zone$" || true
      )

      # CHANGE: Normalize empty count values to zero.
      if [ -z "$count" ]; then
        count=0
      fi

      # CHANGE: Replaced emoji output with ASCII status labels for reliable terminal rendering.
      if [ "$count" -gt 0 ]; then
        printf "  %-15s %-2d pods [OK]\n" "$zone:" "$count"
      else
        printf "  %-15s %-2d pods [WARN] no pods in this zone\n" "$zone:" "$count"
      fi
    done
  done
fi

echo ""
echo "------------------------------------------------------------------------"
echo "Topology spread analysis complete."
echo ""
echo "INTERPRETATION GUIDE:"
echo "  [OK]   = Pods present in this zone, good for high availability."
echo "  [WARN] = No pods in this zone, investigate if this is unexpected."
echo ""
