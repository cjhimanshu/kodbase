require('dotenv').config();
const mongoose = require('mongoose');
const userModel = require('../models/userModel');

async function fixIndexes() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codeIDE';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Drop existing indexes that are causing issues
    console.log('Dropping problematic indexes...');
    try {
      await mongoose.connection.db.collection('users').dropIndex('googleId_1');
      console.log('Dropped googleId index');
    } catch (err) {
      console.log('No googleId index found or error dropping:', err.message);
    }

    try {
      await mongoose.connection.db.collection('users').dropIndex('facebookId_1');
      console.log('Dropped facebookId index');
    } catch (err) {
      console.log('No facebookId index found or error dropping:', err.message);
    }

    try {
      await mongoose.connection.db.collection('users').dropIndex('githubId_1');
      console.log('Dropped githubId index');
    } catch (err) {
      console.log('No githubId index found or error dropping:', err.message);
    }

    // Create new sparse indexes
    console.log('Creating new sparse indexes...');
    await mongoose.connection.db.collection('users').createIndex(
      { googleId: 1 }, 
      { sparse: true }
    );
    await mongoose.connection.db.collection('users').createIndex(
      { facebookId: 1 }, 
      { sparse: true }
    );
    await mongoose.connection.db.collection('users').createIndex(
      { githubId: 1 }, 
      { sparse: true }
    );

    console.log('Indexes fixed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing indexes:', error);
    process.exit(1);
  }
}

fixIndexes();
