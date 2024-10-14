variable "environment" {
  type = string
  description = "environment: staging/production"
}

variable "arn-acm_cognito-domain" {
  type = string
  description = "ARN of ACM used for production cognito domain"
}

variable "cognito_callback_url" {
  type = list(string)
  description = "Cognito callback url"
}

variable "cognito_logout_url" {
  type = string
  description = "Cognito logout url"
}

variable "cognito_domain" {
  type = string
  description = "Cognito domain"
}

variable "cognito_subdomain" {
  type = string
  description = "Cognito sub-domain"
}

variable "only-notes_hosted-zone" {
  type = string
  description = "Onlynotes hosted zone id"
}
