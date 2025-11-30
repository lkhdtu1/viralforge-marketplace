# Role-Based Dashboards Implementation

## Overview
Separated dashboards for Brands and Creators based on their different needs and workflows.

## Database Schema (from Prisma)

### Key Models:
- **User**: Has `role` field (BRAND, CREATOR, ADMIN)
- **Campaign**: Created by brands, has budget, requirements, status
- **Listing**: Created by creators, their service offerings
- **Contract**: Links brands and creators for work
- **Transaction**: Payment history
- **Message**: Communication between users

### Relationships:
- Brands → Create Campaigns
- Creators → Create Listings (services they offer)
- Brands + Creators → Contracts (work agreements)
- Contracts → Transactions (payments)

## Implementation

### 1. RoleBasedRoute Component
- Checks user role from AuthContext
- Routes to BrandDashboard or CreatorDashboard
- Used at `/dashboard` route

### 2. Brand Dashboard
**Features:**
- Create & manage campaigns
- View campaign analytics
- Recent campaigns (limit 5)
- Overview metrics (impressions, engagement, ROI)
- Quick actions (create campaign, view marketplace)

**What Brands Can Do:**
- ✅ Create campaigns
- ✅ Browse creator marketplace
- ✅ View applications from creators
- ✅ Manage contracts
- ✅ Track campaign performance
- ✅ Message creators

### 3. Creator Dashboard
**Features:**
- Browse available campaigns
- View active contracts
- Earnings overview
- Messages from brands
- Quick apply to campaigns

**What Creators Can Do:**
- ✅ Browse campaigns
- ✅ Apply to campaigns
- ✅ Manage their profile/listings
- ✅ View contracts & earnings
- ✅ Message brands
- ❌ Cannot create campaigns

## Routes

### Public Routes:
- `/` - Landing page
- `/marketplace` - Browse creators (for brands)
- `/campaigns` - Browse campaigns (for creators)
- `/auth` - Login/Signup

### Protected Routes (Both):
- `/dashboard` - Role-based (BrandDashboard or CreatorDashboard)
- `/messages` - Communication
- `/settings` - Account settings
- `/orders` - Order history

### Brand-Only Routes:
- `/campaigns/new` - Create campaign
- `/campaigns/:id/analytics` - Campaign analytics

### Creator-Only Routes:
- `/campaigns/:id` - View campaign details (to apply)

## User Flow

### Brand Flow:
1. Signup as BRAND
2. Login → Redirected to BrandDashboard
3. Create campaigns
4. Browse creators in marketplace
5. Review applications
6. Create contracts
7. Track performance

### Creator Flow:
1. Signup as CREATOR
2. Login → Redirected to CreatorDashboard
3. Browse available campaigns
4. Apply to campaigns
5. Manage contracts
6. Track earnings
7. Create service listings

## Files Modified/Created

### Modified:
- `src/components/RoleBasedRoute.tsx` - Use AuthContext instead of localStorage
- `src/App.tsx` - Use RoleBasedRoute for /dashboard
- `src/pages/BrandDashboard.tsx` - Copied from Dashboard.tsx with backend integration

### Created:
- `src/pages/CreatorDashboard.tsx` - New creator-specific dashboard

## Next Steps (Future Enhancements)

### For Creators:
1. Create/manage service listings
2. Application system for campaigns
3. Contract management UI
4. Earnings & payment history
5. Portfolio/profile builder
6. Performance analytics

### For Brands:
1. Application review system
2. Creator search & filters
3. Contract creation workflow
4. Payment/escrow management
5. Advanced analytics
6. Bulk campaign management

### For Both:
1. Real-time messaging
2. Notification system
3. File uploads (deliverables)
4. Review/rating system
5. Dispute resolution
6. Advanced search

## Testing

1. **Create Brand Account:**
   - Signup with role: BRAND
   - Should see BrandDashboard with campaign creation

2. **Create Creator Account:**
   - Signup with role: CREATOR
   - Should see CreatorDashboard with available campaigns
   - Should NOT see "Create Campaign" button

3. **Switch Between Accounts:**
   - Logout and login with different roles
   - Verify correct dashboard loads
