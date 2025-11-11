# ⚠️ IMPORTANT: ACTION REQUIRED! ⚠️

## 🚨 YOUR DATABASE IS NOT SET UP YET

The admin dashboard won't work until you manually run the SQL migration files in Supabase.

---

## ✅ DO THIS NOW (5 Minutes)

### 1️⃣ Open Supabase Dashboard

Go to: <https://supabase.com/dashboard>

### 2️⃣ Run MIGRATION.sql

- Click "SQL Editor" → "New Query"
- Open file: `/MIGRATION.sql`
- Copy ALL 750+ lines
- Paste and click "Run"
- Wait for "Success" ✅

### 3️⃣ Run SEED_DATA.sql

- Click "New Query" again
- Open file: `/SEED_DATA.sql`
- Copy ALL 500+ lines
- Paste and click "Run"
- Wait for "Success" ✅

### 4️⃣ Make Yourself Admin

In SQL Editor, run this (use YOUR email):

```sql
UPDATE public.users
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### 5️⃣ Test It

- Sign up in your app
- Sign out and sign in again
- Click "Admin Dashboard"
- You should see 16 products!

---

## 📚 Need More Help?

Read these files in order:

1. `/RUN_THIS_FIRST.md` - Quick setup guide
2. `/SETUP_COMPLETE.md` - Full overview
3. `/DATABASE_SETUP_GUIDE.md` - Detailed instructions

---

## 🎯 What You Get

After running the migration:

- ✅ 13 database tables
- ✅ 16 products (coffee + equipment)
- ✅ 6 events
- ✅ 4 blog posts
- ✅ Promotional offers
- ✅ Admin dashboard with real data
- ✅ Production-ready database

---

## ⚡ Quick Check

After migration, verify in SQL Editor:

```sql
-- Should return 16
SELECT COUNT(*) FROM products;

-- Should show your admin status
SELECT email, role FROM users WHERE email = 'your-email@example.com';
```

---

# 🎉 DO THE MIGRATION NOW

**The database won't work without it!**

**See `/RUN_THIS_FIRST.md` for step-by-step instructions!**

---

## 🆘 Troubleshooting

**"No products showing"**

- You didn't run SEED_DATA.sql

**"Access denied to admin dashboard"**

- You didn't update your user role to 'admin'
- Sign out and sign in after updating role

**"Table already exists"**

- Migration was run before
- See `/DATABASE_SETUP_GUIDE.md` for cleanup

---

**🚨 DON'T SKIP THIS! THE APP WON'T WORK WITHOUT THE MIGRATION! 🚨**
