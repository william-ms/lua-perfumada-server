import express from "express";

//:::::::::::::::::::::::::::::::: MIDDLEWARES ::::::::::::::::::::::::::::::://
import handleValidationErrors from "../middlewares/validationMiddleware.js";

//:::::::::::::::::::::::::::::::: CONTROLLERS ::::::::::::::::::::::::::::::://
import UserController from "../controllers/UserController.js";

//:::::::::::::::::::::::::::::::: VALIDATIONS ::::::::::::::::::::::::::::::://
import { indexUserValidation } from "../validations/UserValidation.js";

const router = express.Router();

// Constant to group middleware
const middlewares = (validation) => [validation, handleValidationErrors];

//:::::::::::::::::::::::::::::::::: ROUTES :::::::::::::::::::::::::::::::::://

//:::::::::: USER :::::::::://
router.get("/user", middlewares(indexUserValidation), UserController.index);

export default router;
