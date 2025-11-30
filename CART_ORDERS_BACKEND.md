# Cart & Orders Backend Implementation

## Overview
Implemented backend API for cart/orders functionality to support the existing frontend.

## Business Flow

### 1. Creator Creates Listings (Services)
- Creators create **Listings** (their service offerings)
- Examples: "Instagram Post", "TikTok Video", "YouTube Sponsorship"
- Each listing has: title, description, price, platform, deliverables

### 2. Brand Browses & Adds to Cart
- Brands browse creator listings in marketplace
- Add listings to cart (client-side, localStorage)
- Cart managed by `CartContext.tsx`

### 3. Checkout Creates Contract
- When brand checks out, creates **Contract**
- Contract links: Brand + Creator + Listing
- Status: PENDING → SIGNED → IN_PROGRESS → COMPLETED

### 4. Payment & Escrow
- Payment creates **Transaction**
- Money held in **Escrow** until work completed
- Escrow status: CREATED → FUNDED → RELEASED

## Backend Routes Created

### `/api/v1/contracts`

#### POST `/contracts`
Create new contract (checkout from cart)
```json
{
  "creatorId": "uuid",
  "listingId": "uuid",
  "title": "Instagram Post Campaign",
  "terms": "Deliver 3 posts within 7 days",
  "amount": 500,
  "currency": "USD"
}
```

#### GET `/contracts`
Get user's contracts (filtered by role)
- Brands see contracts they created
- Creators see contracts assigned to them
- Query params: `status`, `page`, `limit`

#### GET `/contracts/:id`
Get contract details
- Includes brand, creator, listing, campaign, escrow info

#### PATCH `/contracts/:id`
Update contract status
```json
{
  "status": "SIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
}
```

#### DELETE `/contracts/:id`
Delete contract (only if PENDING)

### `/api/v1/listings`

#### POST `/listings` (Creator only)
Create service listing
```json
{
  "title": "Instagram Story Package",
  "description": "3 Instagram stories with swipe-up",
  "price": 250,
  "platform": ["instagram"],
  "deliverables": "3 stories, analytics report",
  "reach": 50000,
  "engagement": 4.5
}
```

#### GET `/listings`
Browse all listings (public)
- Query params: `status`, `creatorId`, `platform`, `featured`, `minPrice`, `maxPrice`, `search`
- Returns active listings by default

#### GET `/listings/:id`
Get listing details

#### PUT `/listings/:id` (Creator owner only)
Update listing

#### DELETE `/listings/:id` (Creator owner only)
Delete listing

## Database Models Used

### Contract
```prisma
model Contract {
  id          String
  brandId     String
  creatorId   String
  campaignId  String?
  listingId   String?
  title       String
  terms       String
  amount      Decimal
  status      ContractStatus
  signedAt    DateTime?
  completedAt DateTime?
}
```

### Listing
```prisma
model Listing {
  id          String
  creatorId   String
  title       String
  description String
  price       Decimal
  platform    String[]
  reach       Int?
  engagement  Decimal?
  status      ListingStatus
  featured    Boolean
}
```

### Transaction
```prisma
model Transaction {
  id         String
  userId     String
  contractId String?
  type       TransactionType
  amount     Decimal
  status     TransactionStatus
}
```

## Frontend Integration

### API Wrappers Added (`src/lib/api.ts`)

```typescript
// Contracts
contractsApi.getAll(params)
contractsApi.getById(id)
contractsApi.create(contractData)
contractsApi.updateStatus(id, status)
contractsApi.delete(id)

// Listings
listingsApi.getAll(params)
listingsApi.getById(id)
listingsApi.create(listingData)
listingsApi.update(id, data)
listingsApi.delete(id)
```

### Existing Frontend Components
- `src/contexts/CartContext.tsx` - Cart management (localStorage)
- `src/pages/Cart.tsx` - Cart page
- `src/pages/Orders.tsx` - Orders page (needs update to use API)

## Next Steps

### 1. Update Cart.tsx Checkout
Currently cart is client-side only. Need to:
- Add checkout button that calls `contractsApi.create()`
- Create contract for each cart item
- Clear cart after successful checkout
- Redirect to orders page

### 2. Update Orders.tsx
Currently uses mock data. Need to:
- Fetch contracts from `contractsApi.getAll()`
- Display real contract data
- Add status updates
- Add messaging/deliverables

### 3. Creator Listings Management
- Create page for creators to manage their listings
- CRUD operations for listings
- Toggle active/inactive status

### 4. Marketplace Integration
- Update marketplace to show creator listings
- Add "Add to Cart" buttons
- Filter by platform, price, etc.

## Testing

### Create Listing (as Creator):
```bash
curl -X POST http://localhost:3001/api/v1/listings \
  -H "Authorization: Bearer <creator_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Instagram Post",
    "description": "Professional Instagram post with your product",
    "price": 250,
    "platform": ["instagram"],
    "deliverables": "1 post, story mention"
  }'
```

### Browse Listings (as Brand):
```bash
curl http://localhost:3001/api/v1/listings
```

### Create Contract (as Brand):
```bash
curl -X POST http://localhost:3001/api/v1/contracts \
  -H "Authorization: Bearer <brand_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "creatorId": "<creator_id>",
    "listingId": "<listing_id>",
    "title": "Instagram Campaign",
    "terms": "Deliver within 7 days",
    "amount": 250
  }'
```

### Get My Contracts:
```bash
curl http://localhost:3001/api/v1/contracts \
  -H "Authorization: Bearer <token>"
```

## Files Created/Modified

### Backend:
- ✅ `backend/src/routes/contracts.routes.ts` - Contract CRUD
- ✅ `backend/src/routes/listings.routes.ts` - Listing CRUD
- ✅ `backend/src/server.ts` - Registered new routes

### Frontend:
- ✅ `src/lib/api.ts` - Added contractsApi and listingsApi

### Existing (needs update):
- ⏳ `src/pages/Cart.tsx` - Add checkout functionality
- ⏳ `src/pages/Orders.tsx` - Use real API data
- ⏳ `src/pages/Marketplace.tsx` - Show listings, add to cart
