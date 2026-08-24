import { Router } from "express";
import rateLimiter from "../middleware/rateLimiter.js";

const router = Router();

router.get("/api/test", rateLimiter, (req, res) => {
    res.json({ message: "Request allowed" });
});

export default router;