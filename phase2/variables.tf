variable "aws_region" {
  description = "AWS region for Phase 2 resources"
  type        = string
  default     = "ap-southeast-2"
}

variable "jenkins_instance_id" {
  description = "Existing Jenkins EC2 instance ID managed by Phase 1"
  type        = string
  default     = "i-0a793efe275fad7fa"
}

variable "project_name" {
  description = "Project name used for resource naming and tags"
  type        = string
  default     = "cloudmart"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

variable "aws_account_id" {
  description = "AWS account ID for this project"
  type        = string
  default     = "352329340838"
}

variable "ecr_repository_name" {
  description = "ECR repository for CloudMart application images"
  type        = string
  default     = "cloudmart-dev"
}

variable "artifact_bucket_name" {
  description = "Globally unique S3 bucket for CI/CD artifacts"
  type        = string
  default     = "cloudmart-cicd-artifacts-352329340838-ap-southeast-2"
}
