resource "aws_api_gateway_rest_api" "onlynotes_api-gateway" {
  name = "onlynotes_api-gateway"
  description = "Only Notes API"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "onlynotes_api-gateway-resource_api" {
  rest_api_id = aws_api_gateway_rest_api.onlynotes_api-gateway.id
  parent_id   = aws_api_gateway_rest_api.onlynotes_api-gateway.root_resource_id
  path_part = "api"
}

resource "aws_api_gateway_resource" "onlynotes_api-gateway-resource_api-v1" {
  rest_api_id = aws_api_gateway_rest_api.onlynotes_api-gateway.id
  parent_id   = aws_api_gateway_resource.onlynotes_api-gateway-resource_api.id
  path_part = "v1"
}

resource "aws_api_gateway_deployment" "onlynotes_api-gateway-deployment" {
  rest_api_id = aws_api_gateway_rest_api.onlynotes_api-gateway.id
  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.onlynotes_api-gateway.body))
  }
  lifecycle {
    create_before_destroy = true
  }
  depends_on = [aws_api_gateway_method.demo-get-method]
}

resource "aws_api_gateway_stage" "onlynotes_api-gateway-stage" {
  deployment_id = aws_api_gateway_deployment.onlynotes_api-gateway-deployment.id
  rest_api_id   = aws_api_gateway_rest_api.onlynotes_api-gateway.id
  stage_name    = "dev"
}


