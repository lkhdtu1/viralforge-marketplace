# Terraform Deployment Guide

This directory contains Terraform configuration for deploying ViralForge backend to Fly.io.

## Prerequisites

1. Install Terraform: https://www.terraform.io/downloads
2. Create a Fly.io account: https://fly.io
3. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
4. Login to Fly.io: `fly auth login`
5. Get your Fly.io API token: https://fly.io/user/personal_access_tokens

## Setup

1. Set your Fly.io API token:
   ```bash
   export FLY_API_TOKEN=your_token_here
   ```

2. Create a `terraform.tfvars` file:
   ```hcl
   jwt_secret            = "your-super-secret-jwt-key-min-32-chars"
   jwt_refresh_secret    = "your-super-secret-refresh-key-min-32-chars"
   stripe_secret_key     = "sk_live_your_stripe_key"
   stripe_publishable_key = "pk_live_your_stripe_key"
   stripe_webhook_secret  = "whsec_your_webhook_secret"
   cors_origin           = "https://your-frontend-domain.com"
   frontend_url          = "https://your-frontend-domain.com"
   ```

3. Initialize Terraform:
   ```bash
   terraform init
   ```

4. Review the plan:
   ```bash
   terraform plan
   ```

5. Apply the configuration:
   ```bash
   terraform apply
   ```

## Alternative: Render.com Deployment

Render.com offers a free tier and simpler deployment. See `render.yaml` for configuration.

## Alternative: Railway.app Deployment

Railway.app also offers a free tier. Connect your GitHub repository and deploy directly.

