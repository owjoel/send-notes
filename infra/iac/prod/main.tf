module "remote-state-storage" {
  source = "./remote state"
}

module "api-gateway" {
  source = "./api gateway"
}

module "cognito" {
  source = "./cognito"
  arn-acm_cognito-domain = var.arn-acm_cognito-domain
}

