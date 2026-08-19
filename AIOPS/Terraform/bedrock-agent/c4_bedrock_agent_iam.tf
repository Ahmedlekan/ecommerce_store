# Trust policy for the Bedrock Agent execution role.
# SourceAccount and SourceArn conditions keep the role scoped to agents in this
# account and region.
data "aws_iam_policy_document" "bedrock_agent_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["bedrock.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:SourceAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }

    condition {
      test     = "ArnLike"
      variable = "AWS:SourceArn"
      values = [
        "arn:${data.aws_partition.current.partition}:bedrock:${var.aws_region}:${data.aws_caller_identity.current.account_id}:agent/*"
      ]
    }
  }
}

# Dedicated execution role for the AIOps Bedrock Agent.
resource "aws_iam_role" "bedrock_agent" {
  name               = "${local.agent_resource_name}-role"
  assume_role_policy = data.aws_iam_policy_document.bedrock_agent_assume_role.json
  tags               = var.tags
}

# The Agent can invoke only the configured Claude Sonnet 4.6 foundation model.
# AMP access stays isolated in the Prometheus evidence Lambda role.
data "aws_iam_policy_document" "bedrock_agent_foundation_model" {
  statement {
    sid = "InvokeConfiguredFoundationModel"
    actions = [
      "bedrock:InvokeModel",
      "bedrock:InvokeModelWithResponseStream"
    ]
    resources = [local.foundation_model_arn]
  }
}

resource "aws_iam_policy" "bedrock_agent_foundation_model" {
  name        = "${local.agent_resource_name}-model-policy"
  description = "Allows the AIOps Bedrock Agent to invoke only its configured foundation model."
  policy      = data.aws_iam_policy_document.bedrock_agent_foundation_model.json
  tags        = var.tags
}

resource "aws_iam_role_policy_attachment" "bedrock_agent_foundation_model" {
  role       = aws_iam_role.bedrock_agent.name
  policy_arn = aws_iam_policy.bedrock_agent_foundation_model.arn
}
