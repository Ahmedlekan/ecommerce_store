# Trust policy allowing only AWS Lambda to assume this execution role.
data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# Dedicated execution role for the read-only Prometheus evidence Lambda.
resource "aws_iam_role" "prometheus_evidence_lambda" {
  name               = "${local.lambda_name}-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
  tags               = var.tags
}

# Least-privilege policy: query only the configured AMP workspace and write only
# the function's own Lambda logs. No EKS, Kubernetes, shell, or remediation
# permissions are granted.
resource "aws_iam_policy" "prometheus_evidence_lambda" {
  name        = "${local.lambda_name}-policy"
  description = "Read-only AMP query access for the Prometheus evidence Lambda."

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "QueryAmpWorkspace"
        Effect = "Allow"
        Action = [
          "aps:QueryMetrics"
        ]
        Resource = local.amp_workspace_arn
      },
      {
        Sid    = "WriteOwnLambdaLogs"
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "${aws_cloudwatch_log_group.prometheus_evidence_lambda.arn}:*"
      }
    ]
  })

  tags = var.tags
}

# Attach the evidence Lambda policy to its dedicated role.
resource "aws_iam_role_policy_attachment" "prometheus_evidence_lambda" {
  role       = aws_iam_role.prometheus_evidence_lambda.name
  policy_arn = aws_iam_policy.prometheus_evidence_lambda.arn
}
