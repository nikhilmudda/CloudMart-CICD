resource "aws_ecr_repository" "cloudmart" {
  name                 = var.ecr_repository_name
  image_tag_mutability = "IMMUTABLE"
  force_delete         = false

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}"
    Project     = "CloudMart-CICD"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
