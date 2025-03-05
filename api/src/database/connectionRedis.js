import { createClient } from "redis";

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

const redisClient = createClient({
	url: `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
});

redisClient.on("connect", () => {
	console.log("Connected to Redis successfully");
});

redisClient.on("error", (err) => {
	console.log("Redis Client Error", err);
});

(async () => {
	await redisClient.connect();
})();

export default redisClient;
