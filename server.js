import "dotenv/config";
import express from "express";
import redisClient from "./config/redis.js";
import testRoutes from "./routes/test.routes.js";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(testRoutes);

redisClient.connect()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error("Unable to connect to Redis:", error.message);
        process.exitCode = 1;
    });