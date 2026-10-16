variable "aws_region" {
  type    = string
  default = "ap-southeast-2"
}

variable "project_name" {
  type    = string
  default = "cloudmart"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "admin_cidr" {
  description = "Your trusted public IPv4 CIDR"
  type        = string

  validation {
    condition     = can(cidrnetmask(var.admin_cidr))
    error_message = "Provide a valid IPv4 CIDR, such as 116.72.157.221/32."
  }
}

variable "jenkins_key_name" {
  type    = string
  default = "cloudmart-jenkins-key"
}

variable "jenkins_instance_type" {
  type    = string
  default = "t3.small"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24"]
}
