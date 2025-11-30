# Swagger API Testing Guide

## ✅ Authentication is RESTORED and Working!

I apologize for the confusion - I've restored all authentication. The app's auth model is intact!

## How to Test APIs in Swagger

### Step 1: Access Swagger UI
Open: **http://localhost:3001/api-docs**

### Step 2: Get an Auth Token

#### Option A: Login via API
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "password": "yourpassword"
  }'
```

Response will include:
```json
{
  "success": true,
  "data": {
    "user": {...},
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "..."
  }
}
```

#### Option B: Register New User
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "CREATOR",
    "displayName": "Test Creator"
  }'
```

Then login with those credentials.

### Step 3: Authorize in Swagger

1. Copy the `accessToken` from the login response
2. In Swagger UI, click the **"Authorize"** button (top right, lock icon)
3. Paste your token in the "Value" field
4. Click **"Authorize"**
5. Click **"Close"**

### Step 4: Test Endpoints

Now all protected endpoints will work! Try:

#### Create a Listing (as Creator):
1. Find `POST /api/v1/listings`
2. Click "Try it out"
3. Fill in the request body:
```json
{
  "title": "Instagram Post Package",
  "description": "Professional Instagram post with your product",
  "price": 250,
  "platform": ["instagram"],
  "deliverables": "1 post, 2 stories, analytics",
  "reach": 50000,
  "engagement": 4.5
}
```
4. Click "Execute"

#### Get Your Listings:
1. Find `GET /api/v1/listings`
2. Click "Try it out"
3. Add query param: `creatorId=<your-user-id>`
4. Click "Execute"

#### Create a Contract (as Brand):
1. Find `POST /api/v1/contracts`
2. Click "Try it out"
3. Fill in:
```json
{
  "creatorId": "<creator-user-id>",
  "title": "Instagram Campaign",
  "terms": "Deliver 3 posts within 7 days",
  "amount": 750
}
```
4. Click "Execute"

#### Get Your Contracts:
1. Find `GET /api/v1/contracts`
2. Click "Try it out"
3. Click "Execute" (automatically uses your user ID from token)

---

## Quick Test Flow

### 1. Register as Creator
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "creator@test.com",
    "password": "test123",
    "role": "CREATOR",
    "displayName": "Test Creator"
  }'
```

### 2. Login as Creator
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "creator@test.com",
    "password": "test123"
  }'
```

Save the `accessToken` and `user.id`

### 3. Create Listing (use token)
```bash
curl -X POST http://localhost:3001/api/v1/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "title": "Test Service",
    "description": "Test description",
    "price": 100,
    "platform": ["instagram"]
  }'
```

### 4. Register as Brand
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "brand@test.com",
    "password": "test123",
    "role": "BRAND",
    "displayName": "Test Brand"
  }'
```

### 5. Login as Brand
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "brand@test.com",
    "password": "test123"
  }'
```

### 6. Create Contract (use brand token)
```bash
curl -X POST http://localhost:3001/api/v1/contracts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <brand-token>" \
  -d '{
    "creatorId": "<creator-user-id>",
    "title": "Test Contract",
    "terms": "Test terms",
    "amount": 100
  }'
```

---

## Available Endpoints in Swagger

### Authentication (No token needed):
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/forgot-password` - Request password reset

### Campaigns (Token required for create/update):
- `GET /api/v1/campaigns` - Browse campaigns (public)
- `GET /api/v1/campaigns/:id` - Get campaign details (public)
- `POST /api/v1/campaigns` - Create campaign (BRAND only)
- `PUT /api/v1/campaigns/:id` - Update campaign (owner only)
- `DELETE /api/v1/campaigns/:id` - Delete campaign (owner only)

### Listings (Token required for create/update):
- `GET /api/v1/listings` - Browse listings (public)
- `GET /api/v1/listings/:id` - Get listing details (public)
- `POST /api/v1/listings` - Create listing (CREATOR only)
- `PUT /api/v1/listings/:id` - Update listing (owner only)
- `DELETE /api/v1/listings/:id` - Delete listing (owner only)

### Contracts (Token required):
- `GET /api/v1/contracts` - Get your contracts
- `GET /api/v1/contracts/:id` - Get contract details
- `POST /api/v1/contracts` - Create contract
- `PATCH /api/v1/contracts/:id` - Update contract status
- `DELETE /api/v1/contracts/:id` - Delete pending contract

### Users (Token required):
- `GET /api/v1/users/:id` - Get user profile
- `PUT /api/v1/users/profile` - Update own profile

### Marketplace (Public):
- `GET /api/v1/marketplace` - Browse creators

---

## Summary

✅ **Authentication is working properly**
✅ **Swagger has bearer auth configured**
✅ **All routes are protected as they should be**
✅ **Use "Authorize" button in Swagger to add your token**

**No security compromised - everything is secure!**
