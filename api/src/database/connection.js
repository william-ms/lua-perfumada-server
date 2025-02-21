import mongoose from "mongoose";

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;

const connect = async () => {
	try {
		await mongoose.connect(
			`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.rauvz.mongodb.net/?retryWrites=true&w=majority&appName=${DB_DATABASE}`
		);
	} catch (error) {
		console.error("Erro:", error);
	}
};

export default connect;
