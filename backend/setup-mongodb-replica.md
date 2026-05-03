# MongoDB Replica Set Setup

Prisma requires MongoDB to run as a replica set. Here's how to set it up:

## Option 1: Quick Local Setup (Recommended)

1. Stop MongoDB if it's running

2. Start MongoDB with replica set:
```bash
mongod --replSet rs0 --dbpath "C:\data\db"
```

3. In another terminal, connect to MongoDB:
```bash
mongosh
```

4. Initialize the replica set:
```javascript
rs.initiate()
```

5. Verify status:
```javascript
rs.status()
```

## Option 2: Using MongoDB Compass

1. Stop your current MongoDB instance
2. Create a new connection with replica set enabled
3. Use connection string: `mongodb://127.0.0.1:27017/?replicaSet=rs0`

## Option 3: Use MongoDB Atlas (Cloud - Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `.env` with the Atlas connection string

## Update .env

After setting up replica set, update your DATABASE_URL:
```
DATABASE_URL="mongodb://127.0.0.1:27017/ethara?replicaSet=rs0"
```

Or for Atlas:
```
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/ethara"
```
