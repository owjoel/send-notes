resource "aws_cognito_user_pool_domain" "onlynotes_user-pool-client-domain" {
  domain = "auth.onlynotes.net"
  user_pool_id = aws_cognito_user_pool.onlynotes_user-pool.id
  certificate_arn = var.arn-acm_cognito-domain

}