resource "aws_cognito_user_pool_client" "onlynotes_user-pool-client" {
  access_token_validity                         = "60"
  allowed_oauth_flows                           = ["code"]
  allowed_oauth_flows_user_pool_client          = "true"
  allowed_oauth_scopes                          = ["email", "openid", "phone"]
  auth_session_validity                         = "3"
  callback_urls                                 = ["https://onlynotes.net/callback"]
  enable_propagate_additional_user_context_data = "false"
  enable_token_revocation                       = "true"
  explicit_auth_flows                           = ["ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_USER_PASSWORD_AUTH", "ALLOW_USER_SRP_AUTH"]
  id_token_validity                             = "60"
  logout_urls                                   = ["https://onlynotes.net/signout"]
  name                                          = "onlynotes"
  prevent_user_existence_errors                 = "ENABLED"
  read_attributes                               = ["email","name"]
  refresh_token_validity                        = "30"
  supported_identity_providers                  = ["COGNITO"]

  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }

  user_pool_id     = aws_cognito_user_pool.onlynotes_user-pool.id
  write_attributes = ["email","name"]
}
