import { beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Thread from '../src/models/Thread.js';
import Subreddit from '../src/models/Subreddit.js';

let mongoServer;

// Run once before all tests
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);

    console.log('In-memory MongoDB connected for tests');
    await Promise.all([Thread.deleteMany({}), Subreddit.deleteMany({})]);
});

// Disconnect and stop server after all tests
afterAll(async () => {
    await Promise.all([Thread.deleteMany({}), Subreddit.deleteMany({})]);
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('In-memory MongoDB stopped');

});
