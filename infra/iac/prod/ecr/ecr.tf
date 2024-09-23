resource "aws_ecr_repository" "account_ecr_repository" {
  name = "${var.app_name}_account-image_${var.environment}"
}