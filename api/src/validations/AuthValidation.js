import { body, cookie } from "express-validator";

//::::::::::::::::::::::::::::::::::: LOGIN :::::::::::::::::::::::::::::::::://
export const loginValidation = [
	// EMAIL
	body("email")
		.trim()
		.escape()
		.notEmpty()
		.withMessage("Informe o email")
		.isEmail()
		.withMessage("Formato de e-mail inválido"),

	// PASSWORD
	body("password").trim().notEmpty().withMessage("Informe a senha"),
];

//::::::::::::::::::::::::::::::::::: TOKEN :::::::::::::::::::::::::::::::::://
export const refreshValidation = [
	// REFRESH TOKEN
	cookie("lua_perfumada_refreshToken")
		.exists()
		.withMessage("Refresh token não encontrado.")
		.isJWT()
		.withMessage("Token inválido."),
];
