import { param, body, query } from "express-validator";
import User from "../models/User.js";
import validateFields from "../helpers/validateFields.js";

//::::::::::::::::::::::::::::::::::: INDEX :::::::::::::::::::::::::::::::::://
export const indexUserValidation = [
	// FIELDS
	query("fields")
		.optional()
		.isArray()
		.withMessage(
			"To filter the fields, pass an Array with the name of the desired fields (fields: ['name', 'email'])"
		)
		.custom(async (value, { req }) => {
			return validateFields(req.query.fields, User.responseFields);
		}),
];
