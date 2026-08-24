import RateLimiter from "../services/rateLimiter.service.js";

const limiter = new RateLimiter({
    capacity: Number(process.env.RATE_LIMIT_CAPACITY || 5),
    refillRate: Number(process.env.RATE_LIMIT_REFILL_RATE || 0.5)
});

export default async function rateLimiter(req, res, next) {
    const userId = String(req.query.user || req.ip || "anonymous");
    const result = await limiter.allowRequest(userId);

    if (!result.allowed) {
        res.set("Retry-After", String(result.retryAfter));
        return res.status(429).json({ message: "Too many requests" });
    }

    next();
}