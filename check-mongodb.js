// Quick MongoDB connectivity check
import { MongoClient } from 'mongodb';

const urls = [
  'mongodb://127.0.0.1:27017',
  'mongodb://localhost:27017',
];

async function checkConnection(url) {
  console.log(`\n🔍 Testing connection to: ${url}`);
  const client = new MongoClient(url, { 
    serverSelectionTimeoutMS: 3000,
    connectTimeoutMS: 3000 
  });
  
  try {
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const admin = client.db().admin();
    const serverInfo = await admin.serverInfo();
    console.log(`   MongoDB version: ${serverInfo.version}`);
    
    // Check if replica set is configured
    try {
      const status = await admin.command({ replSetGetStatus: 1 });
      console.log(`   ✅ Replica set: ${status.set}`);
      console.log(`   ✅ Replica set is configured!`);
      return { success: true, replicaSet: true, url };
    } catch (error) {
      console.log('   ⚠️  Replica set: NOT CONFIGURED');
      console.log('   ℹ️  MongoDB is running but needs replica set for Prisma');
      return { success: true, replicaSet: false, url };
    }
  } catch (error) {
    console.log(`   ❌ Connection failed: ${error.message}`);
    return { success: false, error: error.message, url };
  } finally {
    await client.close();
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════');
  console.log('   MongoDB Connectivity Check');
  console.log('═══════════════════════════════════════════════');
  
  const results = [];
  
  for (const url of urls) {
    const result = await checkConnection(url);
    results.push(result);
  }
  
  console.log('\n═══════════════════════════════════════════════');
  console.log('   Summary');
  console.log('═══════════════════════════════════════════════');
  
  const successfulConnection = results.find(r => r.success);
  
  if (!successfulConnection) {
    console.log('\n❌ MongoDB is NOT running or not accessible');
    console.log('\n📝 To start MongoDB:');
    console.log('   1. Check if MongoDB service is running');
    console.log('   2. Start MongoDB: mongod --replSet rs0 --port 27017');
    console.log('   3. Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas');
    process.exit(1);
  }
  
  if (successfulConnection.replicaSet) {
    console.log('\n✅ MongoDB is running with replica set!');
    console.log('✅ Ready to use with Prisma!');
    console.log(`\n📝 Connection string for .env:`);
    console.log(`   DATABASE_URL="${successfulConnection.url}/ethara?replicaSet=rs0&directConnection=true"`);
  } else {
    console.log('\n⚠️  MongoDB is running but WITHOUT replica set');
    console.log('\n📝 To enable replica set:');
    console.log('   1. Stop MongoDB');
    console.log('   2. Start with: mongod --replSet rs0 --port 27017 --dbpath "C:\\data\\db"');
    console.log('   3. In another terminal: mongosh');
    console.log('   4. Run: rs.initiate()');
    console.log('\n   OR use MongoDB Atlas (easier): https://www.mongodb.com/cloud/atlas');
    console.log('\n   See MONGODB_SETUP.md for detailed instructions');
  }
  
  console.log('\n═══════════════════════════════════════════════\n');
}

main().catch(console.error);
