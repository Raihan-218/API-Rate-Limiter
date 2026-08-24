import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    socket: {
        reconnectStrategy: false
    }
});

redisClient.on("error", (error) => {
    console.error("Redis client error:", error.message || String(error));
});

export default redisClient;