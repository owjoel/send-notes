#module "remote-state-storage" {
#  source = "./remote state"
#  environment = var.environment
#}

#module "api-gateway" {
#  source = "./api gateway"
#  environment = var.environment
#}

module "ecr" {
  source = "./ecr"
  environment = var.environment
  app_name = var.app_name
}

#module "ecs" {
#  source = "./ecs"
#  environment = var.environment
#  app_name = var.app_name
#  account_app_container_port = var.account_app_container_port
#  availability_zones = var.availability_zones
#}

module "cognito" {
  source = "./cognito"
  arn-acm_cognito-domain = var.arn-acm_cognito-domain
  environment = var.environment
  cognito_callback_url = var.cognito_callback_url
  cognito_logout_url = var.cognito_logout_url
  cognito_domain = var.cognito_domain
  cognito_subdomain = var.cognito_subdomain
  only-notes_hosted-zone = var.only-notes_hosted-zone
}

