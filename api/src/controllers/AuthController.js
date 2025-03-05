import { matchedData } from "express-validator";
import Controller from "./Controller.js";
import User from "../models/User.js";
import Session from "../models/Session.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redisClient from "../database/connectionRedis.js";

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";
const ACCESS_COOKIE_MAX_AGE = 15 * 60 * 1000; // 15m
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7d

const cookieOptions = {
	httpOnly: true,
	secure: process.env.ENVIRONMENT === "production",
	sameSite: "Strict",
};

//:::::::::::::::::::::::::::::: GENERATE TOKEN :::::::::::::::::::::::::::::://
const generateToken = (user, secret, expiresIn) => {
	return jwt.sign(
		{
			id: user._id,
			role: user.role,
		},
		secret,
		{ expiresIn: expiresIn }
	);
};

class AuthController extends Controller {
	//::::::::::::::::::::::::::::::::: LOGIN :::::::::::::::::::::::::::::::://
	async login(req, res) {
		try {
			const data = matchedData(req);
			const { email, password } = data;

			// Valida os dados do usuário
			const user = await User.findOne({ email: email });
			if (!user) {
				return super.success(res, { message: "Email ou senha inválidos" }, 400);
			}

			const checkPassword = await bcrypt.compare(password, user.password);
			if (!checkPassword) {
				return super.success(res, { message: "Email ou senha inválidos" }, 400);
			}

			// Gera os tokens
			const accessToken = generateToken(user, process.env.JWT_ACCESS_SECRET, ACCESS_TOKEN_EXPIRES_IN);
			const refreshToken = generateToken(user, process.env.JWT_REFRESH_SECRET, REFRESH_TOKEN_EXPIRES_IN);

			// Salva a sessão do usuário
			const session = await Session.create({
				userId: user.id,
				refreshToken: refreshToken,
				userAgent: req.headers["user-agent"] || null,
				ip: req.ip || req.connection.remoteAddress,
				expiresAt: new Date(Date.now() + REFRESH_COOKIE_MAX_AGE),
			});

			// Gera os cookies dos tokens
			res.cookie(
				"lua_perfumada_accessToken",
				accessToken,
				Object.assign({}, cookieOptions, { maxAge: ACCESS_COOKIE_MAX_AGE })
			);

			res.cookie(
				"lua_perfumada_refreshToken",
				refreshToken,
				Object.assign({}, cookieOptions, { maxAge: REFRESH_COOKIE_MAX_AGE })
			);

			// Retorna a resposta
			return super.success(res, { message: "Login realizado com sucesso" }, 200);
		} catch (error) {
			return super.handleErrors(error, res);
		}
	}

	//:::::::::::::::::::::::::::::::: LOGOUT :::::::::::::::::::::::::::::::://
	async logout(req, res) {
		try {
			// Acessa e descodifica os tokens
			const accessToken = req.cookies.lua_perfumada_accessToken;
			const refreshToken = req.cookies.lua_perfumada_refreshToken;

			const decodedAcessToken = jwt.decode(accessToken);
			const decodedRefreshToken = jwt.decode(refreshToken);

			const expAcessToken = decodedAcessToken.exp - Math.floor(Date.now() / 1000);
			const expRefreshToken = decodedRefreshToken.exp - Math.floor(Date.now() / 1000);

			// Adicione os tokens na blacklist
			await redisClient.setEx(`bl_${accessToken}`, expAcessToken, "true");
			await redisClient.setEx(`bl_${refreshToken}`, expRefreshToken, "true");

			// Remove a sessão do usuário
			const session = await Session.deleteOne({ refreshToken });

			// Remove os cookies dos tokens
			res.clearCookie("lua_perfumada_accessToken", cookieOptions);
			res.clearCookie("lua_perfumada_refreshToken", cookieOptions);

			return super.success(res, { message: "Logout realizado com sucesso" }, 200);
		} catch (error) {
			return super.handleErrors(error, res);
		}
	}

	//:::::::::::::::::::::::::::::::: REFRESH ::::::::::::::::::::::::::::::://
	async refresh(req, res) {
		try {
			const refreshToken = req.cookies.lua_perfumada_refreshToken;

			jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
				if (err) return super.success(res, {}, 403);
			});

			const session = await Session.findOne({ refreshToken });
			if (!session) return super.success(res, {}, 403);

			const user = await User.findById(session.userId);

			const accessToken = generateToken(user, process.env.JWT_ACCESS_SECRET, ACCESS_TOKEN_EXPIRES_IN);

			res.cookie(
				"lua_perfumada_accessToken",
				accessToken,
				Object.assign({}, cookieOptions, { maxAge: ACCESS_COOKIE_MAX_AGE })
			);

			return super.success(res, {}, 200);
		} catch (error) {
			return super.handleErrors(error, res);
		}
	}

	//::::::::::::::::::::::::::::::::: AUTH ::::::::::::::::::::::::::::::::://
	async auth(req, res) {
		try {
			const accessToken = req.cookies.lua_perfumada_accessToken;
			let user = null;

			if (!accessToken) {
				const refreshToken = req.cookies.lua_perfumada_refreshToken;
				if (!refreshToken) return super.success(res, {}, 200);

				jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
					if (err) super.success(res, {}, 200);
				});

				const isBlacklisted = await redisClient.get(`bl_${refreshToken}`);
				if (isBlacklisted) return super.success(res, {}, 200);

				const session = await Session.findOne({ refreshToken });
				if (!session) return super.success(res, {}, 200);

				user = await User.findById(session.userId);

				const accessToken = generateToken(user, process.env.JWT_ACCESS_SECRET, ACCESS_TOKEN_EXPIRES_IN);
				res.cookie(
					"lua_perfumada_accessToken",
					accessToken,
					Object.assign({}, cookieOptions, { maxAge: ACCESS_COOKIE_MAX_AGE })
				);
			} else {
				const isBlacklisted = await redisClient.get(`bl_${accessToken}`);
				if (isBlacklisted) return super.success(res, {}, 200);

				jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (error, tokenUser) => {
					if (error) return super.success(res, {}, 200);
					user = tokenUser;
				});

				user = await User.findById(user.id);
			}

			//Filtragem e ordenação dos campos
			user = User.responseFields.reduce((acc, field) => {
				if (field !== "_id") acc[field] = user[field];
				return acc;
			}, {});

			return super.success(res, { auth: user }, 200);
		} catch (error) {
			return super.handleErrors(error, res);
		}
	}
}

export default new AuthController();
