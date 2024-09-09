terraform {
  backend "s3" {
    bucket = "onlynotes-tf-state-production"
    key    = "state/prod/terraform.tfstate"
    region = "ap-southeast-1"
    encrypt = true

    dynamodb_table = "onlynotes_tf-state-production_state-lock"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "ap-southeast-1"
}
