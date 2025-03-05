import Controller from "./Controller.js";
import crypto from "crypto";

class UserController extends Controller {
	//::::::::::::::::::::::::::::::::: INDEX :::::::::::::::::::::::::::::::://
	async get(req, res) {
		try {
			const csrfToken = crypto.randomBytes(32).toString("hex");

			res.cookie("XSRF-TOKEN", csrfToken, {
				httpOnly: false,
				secure: process.env.NODE_ENV === "production",
				sameSite: "Strict",
			});

			return super.success(res, { csrfToken: csrfToken }, 200);
		} catch (error) {
			return super.handleErrors(error, res);
		}
	}
}

export default new UserController();
