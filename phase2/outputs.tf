output "jenkins_elastic_ip" {
  description = "Static public IPv4 address for Jenkins"
  value       = aws_eip.jenkins.public_ip
}

output "ecr_repository_url" {
  description = "ECR repository URL for CloudMart images"
  value       = aws_ecr_repository.cloudmart.repository_url
}

output "ecr_repository_name" {
  description = "ECR repository name"
  value       = aws_ecr_repository.cloudmart.name
}

output "artifact_bucket_name" {
  description = "S3 bucket for CI/CD artifacts"
  value       = aws_s3_bucket.artifacts.bucket
}

output "jenkins_iam_role_name" {
  description = "IAM role assumed by the Jenkins EC2 instance"
  value       = aws_iam_role.jenkins.name
}

output "jenkins_instance_profile_name" {
  description = "IAM instance profile attached to Jenkins"
  value       = aws_iam_instance_profile.jenkins.name
}
