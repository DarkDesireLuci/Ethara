# MongoDB Replica Set Setup for Ethara

Prisma requires MongoDB to run as a replica set. Follow these steps:

## Quick Setup Steps

### Step 1: Stop Current MongoDB

If MongoDB is running as a service:
```powershell
net stop MongoDB
```

Or if running in a terminal, press `Ctrl+C`

### Step 2: Start MongoDB with Replica Set

Open a new terminal and run:
```powershell
mongod --replSet rs0 --port 27017 --dbpath "C:\data\db"
```

**Note:** Adjust the `--dbpath` to your MongoDB data directory. Common paths:
- `C:\data\db`
- `C:\Program Files\MongoDB\Server\7.0\data`

### Step 3: Initialize Replica Set

Open another terminal and run:
```powershell
cd backend
node init-mongodb-replica.js
```

Or manually using mongosh:
```powershell
mongosh
```

Then in the MongoDB shell:
```javascript
rs.initiate()
```

### Step 4: Verify Setup

Check replica set status:
```javascript
rs.status()
```

You should see `"ok" : 1` in the output.

### Step 5: Restart Backend

The backend should automatically restart and connect successfully!

---

## Alternative: Use MongoDB Atlas (Easier!)

If local setup is complex, use MongoDB Atlas (free tier):

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free M0 cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get your connection string
6. Update `backend/.env`:

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/ethara?retryWrites=true&w=majority"
JWT_SECRET="supersecret123"
PORT=3000
```

7. Restart the backend

---

## Troubleshooting

### Error: "This node was not started with replication enabled"
- Make sure you started MongoDB with `--replSet rs0` flag

### Error: "Cannot connect to MongoDB"
- Check if MongoDB is running: `mongosh` should connect
- Verify the port (default is 27017)

### Error: "Authentication failed"
- If you have auth enabled, add credentials to connection string:
  `mongodb://username:password@127.0.0.1:27017/ethara?replicaSet=rs0`

### Still having issues?
- Check MongoDB logs
- Ensure no firewall is blocking port 27017
- Try using MongoDB Compass to connect and verify

---

## Windows Service Setup (Optional)

To run MongoDB as a Windows service with replica set:

1. Create config file `C:\mongodb\mongod.cfg`:
```yaml
systemLog:
  destination: file
  path: C:\mongodb\log\mongod.log
storage:
  dbPath: C:\mongodb\data
replication:
  replSetName: rs0
net:
  port: 27017
  bindIp: 127.0.0.1
```

2. Install service:
```powershell
mongod --config "C:\mongodb\mongod.cfg" --install
```

3. Start service:
```powershell
net start MongoDB
```

4. Initialize replica set (first time only):
```powershell
mongosh
rs.initiate()
```
