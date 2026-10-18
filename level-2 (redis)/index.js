import express from 'express';
import dotenv from 'dotenv';
import connectDB from './lib/db.js';
import User from './model/user.model.js';
import { Redis } from 'ioredis';
import rateLimitter from './middleware/ratelimiting.js';
import sendEmail from './lib/sendEmail.js';
import emailQueue from './queue.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

export const redis = new Redis(process.env.REDIS_URL);

// Getting data directly from Redis
app.get('/getAllUserWithRedis', rateLimitter ,async (req, res) => {
    const cachedUsers = await redis.get('users:all');
    if(!cachedUsers){
        const users = await User.find({});
        await redis.set('users:all', JSON.stringify(users), 'EX', 600); // Cache for 600 seconds
        return res.json({ message: 'Users fetched successfully', users: JSON.parse(users) }); 
    }
    return res.json({ message: 'Users fetched successfully', users: JSON.parse(cachedUsers) });  
});

// Getting data directly from MongoDB
app.get('/getAllUser',rateLimitter, async (req, res) => {
    const users = await User.find({});
    return res.status(200).json(users);
});

app.post('/create', async (req, res) => {
    const { name, email, password } = req.body;
    await redis.del('users:all'); // Invalidate cache when a new user is created
    const user = await User.create({ name, email, password });

    // await sendEmail(); // Simulate sending email after user creation

    await emailQueue.add('sendEmail', { email: user.email }); // Add email sending task to the queue
    return res.status(201).json({ message: 'User created successfully', user });
});

//OTP generation and storage in Redis
app.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    await redis.set(`otp:${email}`, otp, 'EX', 30); // Store OTP in Redis with a 30 sec expiration
    console.log(`OTP for ${email}: ${otp}`); // In a real application, you would send this OTP via email or SMS
    return res.status(200).json({ message: 'OTP sent successfully' });
});

// Verify OTP
app.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;
    const storedOtp = await redis.get(`otp:${email}`);
    if (storedOtp === otp) {
        await redis.del(`otp:${email}`); // Invalidate OTP after successful verification
        return res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
});


app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
}
);


// without redis : time taken to get data is 50ms
// with redis : time taken to get data is 7ms