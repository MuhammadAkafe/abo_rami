# Migration Guide: Integer IDs to UUID

This guide explains how to migrate from Integer IDs to UUID (String) IDs.

## ⚠️ Important: Data Loss Warning

**This migration will DELETE ALL EXISTING DATA** in your database. Make sure to:
1. Backup your database before proceeding
2. Export any important data if needed
3. Understand that all users, suppliers, tasks, and cities will be deleted

## Steps to Migrate

### 1. Backup Your Database (IMPORTANT!)
```bash
# Export your data if needed
pg_dump your_database > backup.sql
```

### 2. Reset the Database
```bash
# Reset the database (this will delete all data)
pnpm prisma migrate reset

# Or manually:
pnpm prisma db push --force-reset
```

### 3. Generate Prisma Client
```bash
y
```

### 4. Run Migrations
```bash
# Create and apply the migration
pnpm prisma migrate dev --name change_ids_to_uuid
```

### 5. Seed the Database (if you have seed data)
```bash
pnpm db:seed
```

## What Changed

### Schema Changes
- All `Int @id @default(autoincrement())` changed to `String @id @default(uuid())`
- All foreign key fields changed from `Int` to `String`
- Models affected:
  - `users.id`: Int → String (UUID)
  - `suppliers.id`: Int → String (UUID)
  - `suppliers.userId`: Int → String (UUID)
  - `tasks.id`: Int → String (UUID)
  - `tasks.supplierId`: Int → String (UUID)
  - `cities.id`: Int → String (UUID)
  - `cities.supplierId`: Int → String (UUID)

### Code Changes
- Removed all `parseInt()` calls for IDs
- Updated `SessionData.id` from `number` to `string`
- Updated all type definitions to use `string` for IDs
- Updated all server actions to accept and use string IDs directly

## Verification

After migration, verify:
1. ✅ Database schema uses UUID for all IDs
2. ✅ Can create new users/suppliers/tasks
3. ✅ All CRUD operations work correctly
4. ✅ No TypeScript errors
5. ✅ No runtime errors with ID operations

## Rollback (if needed)

If you need to rollback:
1. Restore from backup: `psql your_database < backup.sql`
2. Revert Prisma schema to use Int IDs
3. Revert code changes
4. Run `pnpm prisma migrate reset` again

