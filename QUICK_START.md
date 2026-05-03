# 🚀 Quick Start Guide

## Current Status

✅ **Backend:** Running on http://localhost:3000
✅ **Frontend:** Running on http://localhost:5173  
✅ **MongoDB:** Running on localhost:27017
⚠️  **Replica Set:** NOT configured (required for login/register)

## 🎯 What You Need to Do

Your MongoDB is running but needs to be configured as a **replica set** for Prisma to work.

### Option 1: Local Setup (5 minutes)

#### Terminal 1: Stop and Restart MongoDB
```powershell
# Stop current MongoDB
net stop MongoDB

# Start with replica set
mongod --replSet rs0 --port 27017 --dbpath "C:\data\db"
```

#### Terminal 2: Initialize Replica Set
```powershell
# Connect to MongoDB
mongosh

# Initialize (run this once)
rs.initiate()

# Verify (should show "ok": 1)
rs.status()

# Exit
exit
```

#### Terminal 3: Seed Test Data
```powershell
cd backend
npm run seed
```

✅ **Done!** Go to http://localhost:5173 and login with:
- Email: `test@example.com`
- Password: `test123`

---

### Option 2: MongoDB Atlas (10 minutes - Easier!)

1. **Sign up:** https://www.mongodb.com/cloud/atlas/register
2. **Create free cluster** (M0 - no credit card)
3. **Create user:** Username: `ethara`, Password: `ethara123`
4. **Whitelist IP:** Add `0.0.0.0/0`
5. **Get connection string** and update `backend/.env`:
   ```env
   DATABASE_URL="mongodb+srv://ethara:ethara123@cluster0.xxxxx.mongodb.net/ethara"
   ```
6. **Seed data:**
   ```powershell
   cd backend
   npm run seed
   ```

✅ **Done!** Login at http://localhost:5173

---

## 🧪 Verify Everything Works

```powershell
# Check MongoDB connection
node check-mongodb.js

# Should show: ✅ MongoDB is running with replica set!
```

---

## 📝 Test Credentials

After seeding:

**Admin User:**
- Email: `test@example.com`
- Password: `test123`

**Demo User:**
- Email: `demo@example.com`  
- Password: `demo123`

---

## 🎮 What You Can Do

### Dashboard
- View project overview
- See task statistics
- Check recent activity

### Projects
- Create new projects
- Add team members
- Manage project settings

### Tasks
- Create tasks with priorities
- Drag & drop between columns (To Do, In Progress, Done)
- Assign tasks to team members
- Set due dates

### Kanban Board
- Visual task management
- Real-time updates
- Drag and drop functionality

---

## 📚 Detailed Guides

- **MongoDB Setup:** See `setup-replica-set.md`
- **Test Credentials:** See `TEST_CREDENTIALS.md`
- **Full Setup:** See `MONGODB_SETUP.md`
- **Issue Details:** See `ISSUE_RESOLVED.md`

---

## 🆘 Need Help?

### MongoDB not starting?
```powershell
# Check if already running
Get-Service -Name MongoDB*

# Check port
netstat -ano | findstr :27017
```

### Can't find mongod?
MongoDB might not be in PATH. Try:
```powershell
# Find MongoDB
where mongod

# Or use full path
"C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --replSet rs0 --port 27017
```

### Still stuck?
Use **MongoDB Atlas** (Option 2) - it's pre-configured and works immediately!

---

## ✅ Success Checklist

- [ ] MongoDB running with replica set
- [ ] Backend running (http://localhost:3000)
- [ ] Frontend running (http://localhost:5173)
- [ ] Database seeded with test data
- [ ] Can login with test@example.com / test123
- [ ] Can see sample project and tasks

**Once all checked, you're ready to go! 🎉**
