# ----------------------------------------------------------------------
# API Gateway Trust Policy
# ----------------------------------------------------------------------
data "aws_iam_policy_document" "apigateway_trust_policy" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["apigateway.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}