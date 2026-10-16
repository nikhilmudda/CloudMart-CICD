provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "CloudMart-CICD"
      Environment = "dev"
      ManagedBy   = "Terraform"
    }
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}
