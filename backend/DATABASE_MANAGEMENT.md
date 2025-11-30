# Database Management

## Clear All Data

To clear all data from the database (useful for removing test/dummy data):

```bash
# From the project root
sudo docker exec -i viralforge-db psql -U viralforge -d viralforge < backend/clear-data.sql
```

This will:
- Remove all users, campaigns, listings, contracts, messages, transactions, and escrows
- Cascade delete all related data
- Leave the schema intact (tables, columns, relationships remain)

## Verify Data is Cleared

```bash
sudo docker exec viralforge-db psql -U viralforge -d viralforge -c "SELECT 'users' as table_name, COUNT(*) FROM users UNION ALL SELECT 'campaigns', COUNT(*) FROM campaigns UNION ALL SELECT 'listings', COUNT(*) FROM listings UNION ALL SELECT 'contracts', COUNT(*) FROM contracts UNION ALL SELECT 'messages', COUNT(*) FROM messages;"
```

## Important Notes

- The database schema is NOT tracked in git (data is stored in Docker volumes)
- Each developer's local database is independent
- After clearing data, you'll need to create new user accounts
- This does NOT affect the schema - only the data
