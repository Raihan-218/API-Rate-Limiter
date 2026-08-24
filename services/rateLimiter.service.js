import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import redisClient from "../config/redis.js";

const scriptPath = fileURLToPath(new URL("../scripts/tokenBucket.lua", import.meta.url));
const tokenBucketScript = await readFile(scriptPath, "utf8");

export default class RateLimiter {
    constructor({ capacity, refillRate }) {
        this.capacity = capacity;
        this.refillRate = refillRate;
    }

    async allowRequest(userId) {
        const result = await redisClient.eval(tokenBucketScript, {
            keys: [`rate-limit:${userId}`],
            arguments: [String(this.capacity), String(this.refillRate), "1"]
        });

        return {
            allowed: result[0] === 1,
            retryAfter: Number(result[2])
        };
    }
}