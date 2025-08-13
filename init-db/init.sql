-- Walter Braun Umzüge Database Initialization
-- This file will be executed when PostgreSQL container starts for the first time

-- Create database if it doesn't exist (this is handled by POSTGRES_DB env var)
-- CREATE DATABASE walter_braun_umzuege;

-- Connect to the database
\c walter_braun_umzuege;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'Europe/Berlin';

-- Create initial tables will be handled by Drizzle migrations
-- This file is mainly for initial setup and extensions

-- Log the initialization
INSERT INTO pg_stat_statements_info VALUES ('Database initialized for Walter Braun Umzüge', NOW()) ON CONFLICT DO NOTHING;

COMMIT;