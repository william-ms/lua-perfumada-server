import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	refreshToken: {
		type: String,
		required: true,
	},
	userAgent: {
		type: String,
	},
	ip: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	expiresAt: {
		type: Date,
		required: true,
	},
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
