## S3 configuration
resource "aws_s3_bucket" "onlynotes_tf-state-production"{
  bucket = "onlynotes-tf-state-production"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "tf-state-production_sse-config" {
  bucket = aws_s3_bucket.onlynotes_tf-state-production.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "AES256"
    }
  }
}

## DynamoDB configuration
resource "aws_dynamodb_table" "onlynotes_tf-state-production_state-lock"{
  name = "onlynotes_tf-state-production_state-lock"
  billing_mode  = "PROVISIONED"
  hash_key      = "LockID"
  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "LockID"
    type = "S"
  }

}