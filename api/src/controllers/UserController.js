import { matchedData } from "express-validator";
import Controller from "./Controller.js";
import User from "../models/User.js";
import mountProjection from "../helpers/mountProjection.js";

class UserController extends Controller {
	//::::::::::::::::::::::::::::::::: INDEX :::::::::::::::::::::::::::::::://
	async index(req, res) {
		try {
			const data = matchedData(req);
			const fields = data.fields || User.responseFields;

			const query = [{ $match: {} }];

			const projection = mountProjection(fields, User);
			query.push({ $project: projection });

			const users = await User.aggregate(query);

			return super.success(res, { data: users }, 200);
		} catch (error) {
			return super.handleErrors(error, res);
		}
	}
}

export default new UserController();
