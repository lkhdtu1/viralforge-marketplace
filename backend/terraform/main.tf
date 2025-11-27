# Terraform configuration for deploying ViralForge backend
# This example uses Fly.io (free tier available)
# Alternative: Render.com, Railway.app, or AWS/GCP

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    fly = {
      source  = "fly-apps/fly"
      version = "~> 0.1"
    }
  }
}

provider "fly" {
  # Fly.io API token - set via FLY_API_TOKEN environment variable
}

# PostgreSQL database (Fly.io Postgres)
resource "fly_postgres" "viralforge_db" {
  app_name    = "viralforge-db"
  region      = "iad" # Washington, D.C.
  vm_size     = "shared-cpu-1x"
  volume_size = 10   # GB
}

# Redis instance (Fly.io Redis)
resource "fly_redis" "viralforge_redis" {
  app_name = "viralforge-redis"
  region   = "iad"
  vm_size  = "shared-cpu-1x"
}

# Backend API application
resource "fly_app" "viralforge_api" {
  name = "viralforge-api"
  org  = "personal" # Change to your Fly.io org
}

resource "fly_ip" "viralforge_api_ip" {
  app  = fly_app.viralforge_api.name
  type = "v4"
}

resource "fly_machine" "viralforge_api" {
  app    = fly_app.viralforge_api.name
  region = "iad"
  name   = "viralforge-api-machine"
  
  image = "your-docker-registry/viralforge-backend:latest"
  
  env = {
    NODE_ENV              = "production"
    PORT                  = "3001"
    DATABASE_URL          = fly_postgres.viralforge_db.connection_string
    REDIS_URL             = fly_redis.viralforge_redis.private_url
    JWT_SECRET            = var.jwt_secret
    JWT_REFRESH_SECRET    = var.jwt_refresh_secret
    STRIPE_SECRET_KEY     = var.stripe_secret_key
    STRIPE_PUBLISHABLE_KEY = var.stripe_publishable_key
    STRIPE_WEBHOOK_SECRET = var.stripe_webhook_secret
    CORS_ORIGIN           = var.cors_origin
    FRONTEND_URL          = var.frontend_url
  }
  
  services = [
    {
      ports = [
        {
          port     = 443
          handlers = ["tls", "http"]
        },
        {
          port     = 80
          handlers = ["http"]
        }
      ]
      protocol      = "tcp"
      internal_port = 3001
    }
  ]
  
  resources = {
    cpu_kind  = "shared"
    cpus      = 1
    memory_mb = 512
  }
}

# Variables
variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}

variable "jwt_refresh_secret" {
  description = "JWT refresh secret key"
  type        = string
  sensitive   = true
}

variable "stripe_secret_key" {
  description = "Stripe secret key"
  type        = string
  sensitive   = true
}

variable "stripe_publishable_key" {
  description = "Stripe publishable key"
  type        = string
  sensitive   = true
}

variable "stripe_webhook_secret" {
  description = "Stripe webhook secret"
  type        = string
  sensitive   = true
}

variable "cors_origin" {
  description = "CORS allowed origins"
  type        = string
  default     = "*"
}

variable "frontend_url" {
  description = "Frontend URL"
  type        = string
}

# Outputs
output "api_url" {
  value = "https://${fly_app.viralforge_api.name}.fly.dev"
}

output "database_url" {
  value     = fly_postgres.viralforge_db.connection_string
  sensitive = true
}

output "redis_url" {
  value     = fly_redis.viralforge_redis.private_url
  sensitive = true
}

