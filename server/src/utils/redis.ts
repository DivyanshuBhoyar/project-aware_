require('dotenv').config();
import Redis from 'ioredis'

export const redis = new Redis({
    // port: 13141,
    // host: 'redis-13141.c212.ap-south-1-1.ec2.cloud.redislabs.com',
    // password: 'RJzGlPXJKB2vADfgKMbTQDr1qrHCKqzM',
})
redis.connect(() => console.log("🧾 Redis connected"))