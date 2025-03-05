import express from "express";

//:::::::::::::::::::::::::::::::: MIDDLEWARES ::::::::::::::::::::::::::::::://
import csrfMiddleware from "../middlewares/csrfMiddleware.js";
import authenticationMiddleware from "../middlewares/authenticationMiddleware.js";
import handleValidationErrors from "../middlewares/validationMiddleware.js";

//:::::::::::::::::::::::::::::::: CONTROLLERS ::::::::::::::::::::::::::::::://
import AuthController from "../controllers/AuthController.js";
import UserController from "../controllers/UserController.js";
import CsrfTokenController from "../controllers/CsrfTokenController.js";

//:::::::::::::::::::::::::::::::: VALIDATIONS ::::::::::::::::::::::::::::::://
import { loginValidation, refreshValidation } from "../validations/AuthValidation.js";
import { indexUserValidation } from "../validations/UserValidation.js";

const router = express.Router();

// Constant to group validation middlewares
const v = (v) => [v, handleValidationErrors];

//:::::::::::::::::::::::::::::::::: ROUTES :::::::::::::::::::::::::::::::::://

//:::::::::: AUTH :::::::::://
router.post("/login", csrfMiddleware, v(loginValidation), AuthController.login);
router.post("/logout", authenticationMiddleware, AuthController.logout);
router.post("/refresh", csrfMiddleware, v(refreshValidation), AuthController.refresh);
router.get("/auth", AuthController.auth);

//:::::::::: USER :::::::::://
router.get("/user", v(indexUserValidation), UserController.index);

//:::::::::: CSRF TOKEN :::::::::://
router.get("/csrf-token", CsrfTokenController.get);

export default router;
