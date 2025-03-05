import jwt from "jsonwebtoken";
import redisClient from "../database/connectionRedis.js";

const authenticationMiddleware = async (req, res, next) => {
	const token = req.cookies.lua_perfumada_accessToken;

	if (!token) {
		return res.status(401).json({ error: "Acesso não autorizado" });
	}

	const isBlacklisted = await redisClient.get(`bl_${token}`);

	if (isBlacklisted) {
		return res.status(403).json({ error: "Acesso não autorizado" });
	}

	jwt.verify(token, process.env.JWT_ACCESS_SECRET, (error, user) => {
		if (error) {
			return res.status(403).json({ error: "Acesso não autorizado" });
		}

		req.auth = user;
		next();
	});
};

export default authenticationMiddleware;
