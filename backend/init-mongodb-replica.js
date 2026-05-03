// Run this script to initialize MongoDB replica set
// Usage: node init-mongodb-replica.js

import { MongoClient } from 'mongodb';

const url = 'mongodb://127.0.0.1:27018?directConnection=true';

async function initReplicaSet() {
  const client = new MongoClient(url);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const admin = client.db().admin();
    
    // Check if replica set is already initialized
    try {
      const status = await admin.command({ replSetGetStatus: 1 });
      console.log('✅ Replica set already initialized:', status.set);
      return;
    } catch (error) {
      // Replica set not initialized, continue
      console.log('Initializing replica set...');
    }
    
    // Initialize replica set
    const config = {
      _id: 'rs0',
      members: [{ _id: 0, host: '127.0.0.1:27018' }]
    };
    
    await admin.command({ replSetInitiate: config });
    console.log('✅ Replica set initialized successfully!');
    console.log('Waiting for replica set to be ready...');
    
    // Wait a bit for replica set to be ready
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const status = await admin.command({ replSetGetStatus: 1 });
    console.log('✅ Replica set status:', status.set);
    console.log('\nYou can now start your application!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nMake sure MongoDB is running with --replSet flag:');
    console.log('mongod --replSet rs0');
  } finally {
    await client.close();
  }
}

initReplicaSet();
