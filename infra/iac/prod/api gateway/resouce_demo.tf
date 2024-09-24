#resource "aws_api_gateway_resource" "onlynotes_api-gateway-resource_api-v1-demo" {
#  rest_api_id = aws_api_gateway_rest_api.onlynotes_api-gateway.id
#  parent_id   = aws_api_gateway_resource.onlynotes_api-gateway-resource_api-v1.id
#  path_part = "demo"
#}
#
#
#resource "aws_api_gateway_method" "demo-get-method" {
#  rest_api_id = aws_api_gateway_rest_api.onlynotes_api-gateway.id
#  resource_id = aws_api_gateway_resource.onlynotes_api-gateway-resource_api-v1-demo.id
#  http_method = "GET"
#  authorization = "NONE"
#}
#
#resource "aws_api_gateway_method_response" "response_200" {
#  rest_api_id = aws_api_gateway_rest_api.onlynotes_api-gateway.id
#  resource_id = aws_api_gateway_resource.onlynotes_api-gateway-resource_api-v1-demo.id
#  http_method = aws_api_gateway_method.demo-get-method.http_method
#  status_code = "200"
#}
#
#
#resource "aws_api_gateway_integration" "demo-integration" {
#  rest_api_id = aws_api_gateway_rest_api.onlynotes_api-gateway.id
#  resource_id = aws_api_gateway_resource.onlynotes_api-gateway-resource_api-v1-demo.id
#  http_method = aws_api_gateway_method.demo-get-method.http_method
#  type        = "MOCK"
#  request_templates = {
#    "application/json" = jsonencode(
#      {
#        statusCode = 200
#      }
#    )
#  }
#}
#
#resource "aws_api_gateway_integration_response" "demo-integration-response" {
#  rest_api_id = aws_api_gateway_rest_api.onlynotes_api-gateway.id
#  resource_id = aws_api_gateway_resource.onlynotes_api-gateway-resource_api-v1-demo.id
#  http_method = aws_api_gateway_method.demo-get-method.http_method
#  status_code = aws_api_gateway_method_response.response_200.status_code
#
#  response_templates = {
#    "application/json" = "{'message': 'Hello there'}"
#  }
#
#  depends_on=[aws_api_gateway_resource.onlynotes_api-gateway-resource_api-v1-demo]
#}