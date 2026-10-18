import {redis} from '../index.js';

const rateLimitter = async (req, res, next) => {
    const ip = req.ip;
    const key = `rate-limit:${ip}`;
    const requests = await redis.incr(key);
    const ttl = await redis.ttl(key);

    if(requests === 1){
        await redis.expire(key, 60); // Set expiration for the first request
    }

    if(requests>5){
        return res.status(429).json({ message: `Too many requests. Try again in ${ttl} seconds.` });
    }

    next();
}


export default rateLimitter;