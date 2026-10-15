import express from 'express';
import dotenv from 'dotenv';
import connectDB from './lib/db.js';
import User from './model/user.model.js';
import { Redis } from 'ioredis';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL);

// Getting data directly from Redis
app.get('/getAllUserWithRedis', async (req, res) => {
    const cachedUsers = await redis.get('users:all');
    if(!cachedUsers){
        const users = await User.find({});
        await redis.set('users:all', JSON.stringify(users), 'EX', 600); // Cache for 600 seconds
        return res.json({ message: 'Users fetched successfully', users: JSON.parse(users) }); 
    }
    return res.json({ message: 'Users fetched successfully', users: JSON.parse(cachedUsers) });  
});

// Getting data directly from MongoDB
app.get('/getAllUser', async (req, res) => {
    const users = await User.find({});
    return res.status(200).json(users);
});

app.post('/create', async (req, res) => {
    const { name, email, password } = req.body;
    await redis.del('users:all'); // Invalidate cache when a new user is created
    const user = await User.create({ name, email, password });

    return res.status(201).json({ message: 'User created successfully', user });
});


app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
}
);


// without redis : time taken to get data is 50ms
// with redis : time taken to get data is 7ms