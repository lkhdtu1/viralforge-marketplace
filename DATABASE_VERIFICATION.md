# Database Connection Verification ✅

## Messages System - Fully Connected

### Database Schema: ✅ VERIFIED
```sql
Table: messages
- id (text, PK)
- senderId (text, FK → users.id)
- receiverId (text, FK → users.id)
- contractId (text, FK → contracts.id, optional)
- subject (text, optional)
- content (text, required)
- isRead (boolean, default: false)
- readAt (timestamp, optional)
- createdAt (timestamp, default: now)

Indexes:
- senderId_idx
- receiverId_idx
- contractId_idx
- isRead_idx

Foreign Keys:
- senderId → users(id) CASCADE
- receiverId → users(id) CASCADE
```

### Backend Routes: ✅ VERIFIED

**Registered in server.ts:**
```typescript
apiRouter.use('/messages', messageRoutes);
```

**Available Endpoints:**

1. **POST /api/v1/messages**
   - Send a message
   - Requires: receiverId, content
   - Optional: contractId, subject
   - Auth: Required
   - Database: INSERT into messages table

2. **GET /api/v1/messages/conversations**
   - Get list of conversations
   - Returns: Array of users you've messaged with
   - Auth: Required
   - Database: SELECT from messages, GROUP BY partner

3. **GET /api/v1/messages/with/:userId**
   - Get all messages with specific user
   - Returns: Array of messages (sorted by time)
   - Auth: Required
   - Database: SELECT from messages WHERE sender/receiver match

4. **PATCH /api/v1/messages/read**
   - Mark messages as read
   - Requires: messageIds array
   - Auth: Required
   - Database: UPDATE messages SET isRead=true

5. **GET /api/v1/messages/:id**
   - Get single message
   - Auth: Required
   - Database: SELECT from messages WHERE id

6. **DELETE /api/v1/messages/:id**
   - Delete message
   - Auth: Required (sender only)
   - Database: DELETE from messages WHERE id

### Frontend API: ✅ VERIFIED

**File:** `src/lib/api.ts`

```typescript
export const messagesApi = {
  getConversations: async () => {
    // Calls: GET /messages/conversations
    // Returns: List of conversations
  },

  getMessages: async (userId: string) => {
    // Calls: GET /messages/with/:userId
    // Returns: Messages with that user
  },

  send: async (messageData) => {
    // Calls: POST /messages
    // Saves to database
  },

  markAsRead: async (messageIds: string[]) => {
    // Calls: PATCH /messages/read
    // Updates database
  },
};
```

### Frontend Component: ✅ VERIFIED

**File:** `src/pages/Messages.tsx`

**Features:**
- Loads conversations from database
- Loads messages from database
- Sends messages to database
- Marks messages as read in database
- Polls database every 5 seconds for new messages

**Data Flow:**
1. User opens Messages page
2. Frontend calls `messagesApi.getConversations()`
3. Backend queries `messages` table
4. Returns conversations grouped by user
5. User selects conversation
6. Frontend calls `messagesApi.getMessages(userId)`
7. Backend queries `messages` table
8. Returns all messages between users
9. User sends message
10. Frontend calls `messagesApi.send()`
11. Backend INSERTs into `messages` table
12. Message saved to database

---

## User Search - Fully Connected

### Database: ✅ VERIFIED
Uses existing `users` table with indexes on:
- displayName
- email
- role
- isActive

### Backend Route: ✅ VERIFIED

**GET /api/v1/users/search?q=<query>&role=<role>**
- Searches users table
- Case-insensitive search
- Returns up to 10 results
- Database: SELECT from users WHERE displayName/email LIKE query

### Frontend: ✅ VERIFIED
- Navbar search component
- Calls `usersApi.search(query)`
- Displays results from database

---

## All Other Features - Database Connected

### Campaigns: ✅
- Table: `campaigns`
- Routes: `/api/v1/campaigns`
- CRUD operations all hit database

### Contracts: ✅
- Table: `contracts`
- Routes: `/api/v1/contracts`
- All operations save to database

### Listings: ✅
- Table: `listings`
- Routes: `/api/v1/listings`
- Creator services stored in database

### Users: ✅
- Table: `users`
- Routes: `/api/v1/auth`, `/api/v1/users`
- Authentication uses database

---

## Testing Database Connection

### Test Messages:
```bash
# 1. Login to get token
TOKEN=$(curl -s -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}' \
  | jq -r '.data.accessToken')

# 2. Get conversations (from database)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/v1/messages/conversations

# 3. Send message (saves to database)
curl -X POST http://localhost:3001/api/v1/messages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receiverId": "<user-id>",
    "content": "Hello from database!"
  }'

# 4. Check database directly
docker exec viralforge-db psql -U viralforge -d viralforge \
  -c "SELECT * FROM messages ORDER BY \"createdAt\" DESC LIMIT 5;"
```

### Test User Search:
```bash
# Search users (from database)
curl "http://localhost:3001/api/v1/users/search?q=test"

# Verify in database
docker exec viralforge-db psql -U viralforge -d viralforge \
  -c "SELECT id, \"displayName\", email, role FROM users WHERE \"displayName\" ILIKE '%test%';"
```

---

## Summary

✅ **Messages table exists in database**
✅ **Backend routes query/insert into database**
✅ **Frontend API calls backend routes**
✅ **Messages page uses real database data**
✅ **User search queries database**
✅ **All features connected to PostgreSQL**

**Everything is connected to the database - NO mock data!** 🎉

The only thing that's "simulated" is the 5-second polling for new messages (instead of WebSocket), but the data itself is 100% from the database.
