variable "environment" {
  type = string
  description = "environment: staging/production"
}

variable "arn-acm_cognito-domain" {
  type = string
  description = "ARN of ACM used for production cognito domain"
}

variable "cognito_callback_url" {
  type = string
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

variable "app_name" {
  type = string
  description = "Applicaiton name"
}


variable "account_app_container_port" {
  type = number
  description = "Account application container's port number"
}

variable "availability_zones" {
  type = list(string)
  description = "List of availability zones"
}
