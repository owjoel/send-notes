variable "environment" {
  type = string
  description = "environment: staging/production"
}

variable "app_name" {
  type = string
  description = "application name"
}

variable "account_app_container_port" {
  type = number
  description = "Account app container's port"
}

variable "availability_zones" {
  type = list(string)
  description = "List of availability zones"
}
