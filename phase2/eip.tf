resource "aws_eip" "jenkins" {
  domain   = "vpc"
  instance = var.jenkins_instance_id

  tags = {
    Name        = "cloudmart-dev-jenkins-eip"
    Project     = "CloudMart-CICD"
    Environment = "dev"
    ManagedBy   = "Terraform"
  }
}
