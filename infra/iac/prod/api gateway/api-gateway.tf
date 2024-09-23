## API Gateway execution role
resource "aws_iam_role" "apigateway_execution_role" {
  name = "${var.environment}_apigateway-role"
  path = "/"
  description = "API Gateway role"
  assume_role_policy = data.aws_iam_policy_document.apigateway_trust_policy.json
}

# ----------------------------------------------------------------------
# API Gateway
# ----------------------------------------------------------------------
resource "aws_api_gateway_rest_api" "employees_rest_api" {
  name       = var.app_name
  endpoint_configuration {
    types = ["REGIONAL"]
  }
  body = templatefile("./files/api-def-v1.yaml", {
    app_name                   = var.app_name,
    api_gateway_execution_role = aws_iam_role.apigateway_execution_role.arn
    get_data_uri               = "${var.lambda_invoke_uri_prefix}/${data.aws_cloudformation_export.api_lambda_arn_cfn_exports["get-data"].value}/invocations"
    put_data_uri               = "${var.lambda_invoke_uri_prefix}/${data.aws_cloudformation_export.api_lambda_arn_cfn_exports["put-data"].value}/invocations"
  })
}

# ----------------------------------------------------------------------
# API Gateway Deployment
# ----------------------------------------------------------------------
resource "aws_api_gateway_deployment" "employees_rest_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.employees_rest_api.id
  stage_name  = "v1"
  variables = {
    "deployed_at" = timestamp()
  }
}

# ----------------------------------------------------------------------
# API Key
# ----------------------------------------------------------------------
resource "aws_api_gateway_api_key" "api_key" {
  name        = "${var.app_name}-key"
  description = "API Key for Employees API"
}

# ----------------------------------------------------------------------
# Usage Plan
# ----------------------------------------------------------------------
resource "aws_api_gateway_usage_plan" "usage_plan" {
  name        = "${var.app_name}-usage-plan-${timestamp()}"
  description = "Usage plan for Employees"
  api_stages {
    api_id = aws_api_gateway_rest_api.employees_rest_api.id
    stage  = aws_api_gateway_deployment.employees_rest_api_deployment.stage_name
  }
}

# ----------------------------------------------------------------------
# API Key - Usage Plan Mapping
# ----------------------------------------------------------------------
resource "aws_api_gateway_usage_plan_key" "usage_plan_key" {
  key_id        = aws_api_gateway_api_key.api_key.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.usage_plan.id
}

##
#
#resource "aws_api_gateway_rest_api" "onlynotes_api-gateway" {
#  name = "onlynotes_api-gateway"
#  description = "Only Notes API"
#  endpoint_configuration {
#    types = ["REGIONAL"]
#  }
#}
#
#resource "aws_api_gateway_resource" "onlynotes_api-gateway-resource_api" {
#  rest_api_id = aws_api_gateway_rest_api.onlynotes_api-gateway.id
#  parent_id   = aws_api_gateway_rest_api.onlynotes_api-gateway.root_resource_id
#  path_part = "api"
#}
#
#resource "aws_api_gateway_resource" "onlynotes_api-gateway-resource_api-v1" {
#  rest_api_id = aws_api_gateway_rest_api.onlynotes_api-gateway.id
#  parent_id   = aws_api_gateway_resource.onlynotes_api-gateway-resource_api.id
#  path_part = "v1"
#}
#
#resource "aws_api_gateway_deployment" "onlynotes_api-gateway-deployment" {
#  rest_api_id = aws_api_gateway_rest_api.onlynotes_api-gateway.id
#  triggers = {
#    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.onlynotes_api-gateway.body))
#  }
#  lifecycle {
#    create_before_destroy = true
#  }
#  depends_on = [aws_api_gateway_method.demo-get-method]
#}
#
#resource "aws_api_gateway_stage" "onlynotes_api-gateway-stage" {
#  deployment_id = aws_api_gateway_deployment.onlynotes_api-gateway-deployment.id
#  rest_api_id   = aws_api_gateway_rest_api.onlynotes_api-gateway.id
#  stage_name    = "dev"
#}
#
