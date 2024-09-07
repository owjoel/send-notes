resource "aws_api_gateway_resource" "onlynotes_api-gateway-resource_api-v1-auth-demo" {
  rest_api_id = aws_api_gateway_rest_api.onlynotes_api-gateway.id
  parent_id   = aws_api_gateway_resource.onlynotes_api-gateway-resource_api-v1.id
  path_part = "auth-demo"
}