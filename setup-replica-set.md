# ✅ MongoDB is Running - Now Enable Replica Set

Your MongoDB is running on **localhost:27017** but needs to be configured as a replica set for Prisma to work.

## 🚀 Quick Setup (Choose One Method)

### Method 1: Restart MongoDB with Replica Set (Recommended)

#### Step 1: Find MongoDB Service
```powershell
# Check if MongoDB is running as a service
Get-Service -Name MongoDB*
```

#### Step 2: Stop MongoDB
```powershell
# If running as service:
net stop MongoDB

# Or if running in terminal, press Ctrl+C
```

#### Step 3: Start MongoDB with Replica Set

**Option A: Using Command Line**
```powershell
mongod --replSet rs0 --port 27017 --dbpath "C:\data\db"
```

**Option B: Using Config File**

Create `mongod.cfg`:
```yaml
systemLog:
  destination: file
  path: C:\mongodb\log\mongod.log
storage:
  dbPath: C:\data\db
replication:
  replSetName: rs0
net:
  port: 27017
  bindIp: 127.0.0.1
```

Then start:
```powershell
mongod --config "C:\path\to\mongod.cfg"
```

#### Step 4: Initialize Replica Set

Open a **NEW terminal** and run:
```powershell
mongosh
```

In the MongoDB shell:
```javascript
rs.initiate()
```

Wait a few seconds, then verify:
```javascript
rs.status()
```

You should see `"ok" : 1` ✅

#### Step 5: Verify Setup
```powershell
node check-mongodb.js
```

Should now show: ✅ MongoDB is running with replica set!

---

### Method 2: Use MongoDB Atlas (Easiest - No Local Setup)

1. **Sign up** at https://www.mongodb.com/cloud/atlas/register
2. **Create a free M0 cluster** (no credit card needed)
3. **Create database user:**
   - Username: `ethara`
   - Password: `ethara123` (or your choice)
4. **Whitelist IP:**
   - Add `0.0.0.0/0` for development (allows all IPs)
5. **Get connection string:**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
6. **Update backend/.env:**
   ```env
   DATABASE_URL="mongodb+srv://ethara:ethara123@cluster0.xxxxx.mongodb.net/ethara?retryWrites=true&w=majority"
   JWT_SECRET="supersecret123"
   PORT=3000
   ```
7. **Done!** Backend will auto-restart and connect

---

## 🧪 Test After Setup

1. **Check connection:**
   ```powershell
   node check-mongodb.js
   ```

2. **Seed test data:**
   ```powershell
   cd backend
   npm run seed
   ```

3. **Login to app:**
   - Open http://localhost:5173
   - Email: `test@example.com`
   - Password: `test123`

---

## 🐛 Troubleshooting

### "mongod is not recognized"
MongoDB CLI tools are not in PATH. Find MongoDB installation:
- Usually: `C:\Program Files\MongoDB\Server\8.0\bin\`
- Add to PATH or use full path

### "Cannot find data directory"
Specify your MongoDB data directory:
```powershell
mongod --replSet rs0 --port 27017 --dbpath "C:\your\data\path"
```

### "Address already in use"
MongoDB is already running. Stop it first:
```powershell
net stop MongoDB
# Or find and kill the process
tasklist | findstr mongod
taskkill /F /PID <process_id>
```

### Still having issues?
Use MongoDB Atlas (Method 2) - it's pre-configured and easier!

---

## 📊 Current Status

✅ MongoDB is installed and running
✅ Accessible on localhost:27017
⚠️  Replica set NOT configured (needed for Prisma)

**Next step:** Follow Method 1 or Method 2 above to enable replica set.
