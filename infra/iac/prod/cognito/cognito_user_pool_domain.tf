resource "aws_cognito_user_pool_domain" "onlynotes_user-pool-client-domain" {
#  name = "${var.environment}-onlynotes_client-domain"
  domain = format("%s.%s", var.cognito_subdomain, var.cognito_domain)
  user_pool_id = aws_cognito_user_pool.onlynotes_user-pool.id
  certificate_arn = var.arn-acm_cognito-domain
  lifecycle {
    prevent_destroy = true
  }

}

resource "aws_route53_record" "www" {
  zone_id = var.only-notes_hosted-zone
  name    = var.cognito_subdomain
  type    = "CNAME"
  ttl     = 300

  records = [aws_cognito_user_pool_domain.onlynotes_user-pool-client-domain.cloudfront_distribution_arn]
  lifecycle {
    prevent_destroy = true
  }
}