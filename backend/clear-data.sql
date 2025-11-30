-- Clear all data from tables (in correct order due to foreign keys)
TRUNCATE TABLE messages CASCADE;
TRUNCATE TABLE contracts CASCADE;
TRUNCATE TABLE listings CASCADE;
TRUNCATE TABLE campaigns CASCADE;
TRUNCATE TABLE transactions CASCADE;
TRUNCATE TABLE escrows CASCADE;
TRUNCATE TABLE users CASCADE;
