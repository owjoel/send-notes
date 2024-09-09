resource "aws_cognito_user_pool" "onlynotes_user-pool" {
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = "1"
    }
  }

  admin_create_user_config {
    allow_admin_create_user_only = "false"

    invite_message_template {
      email_message = "Hi {username},\nYour temporary password is {####}"
      email_subject = "OnlyNotes temporary password"
      sms_message   = "Hi {username},\nYour temporary password is {####}"
    }
  }

  alias_attributes         = ["email"]
  auto_verified_attributes = ["email"]
  deletion_protection      = "ACTIVE"

  email_configuration {
    email_sending_account = "DEVELOPER"
    from_email_address    = "Onlynotes <noreply@onlynotes.net>"
    source_arn            = "arn:aws:ses:ap-southeast-1:211125709264:identity/onlynotes.net"
  }

  mfa_configuration = "OPTIONAL"
  name              = "onlynotes"

  password_policy {
    minimum_length                   = "8"
    password_history_size            = "0"
    require_lowercase                = "true"
    require_numbers                  = "true"
    require_symbols                  = "true"
    require_uppercase                = "true"
    temporary_password_validity_days = "7"
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = "false"
    mutable                  = "true"
    name                     = "email"
    required                 = "true"

    string_attribute_constraints {
      max_length = "2048"
      min_length = "0"
    }
  }

  software_token_mfa_configuration {
    enabled = "true"
  }

  user_attribute_update_settings {
    attributes_require_verification_before_update = ["email"]
  }

  username_configuration {
    case_sensitive = "false"
  }

  verification_message_template {
    default_email_option  = "CONFIRM_WITH_LINK"
    email_message_by_link = "Please click {##Verify Email##} to verify your email address. \nIf you did not perform this action, ignore this email.\n\nWagwan my G"
    email_subject_by_link = "OnlyNotes verification"
  }
}
