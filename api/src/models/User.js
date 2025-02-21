import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "E-mail inválido"],
		},
		password: {
			type: String,
			required: true,
		},
		addresses: [
			{
				street: String,
				city: String,
				state: String,
				zipCode: String,
				isDefault: { type: Boolean, default: false },
			},
		],
		role: {
			type: String,
			enum: ["customer", "admin"],
			default: "customer",
		},
	},
	{
		timestamps: true,
	}
);

// Valida se apenas um endereço está marcado como default
userSchema.path("addresses").validate(function (addresses) {
	const defaultCount = addresses.filter((addr) => addr.isDefault).length;
	return defaultCount <= 1;
}, "Only one address can be marked as default (isDefault: true)");

userSchema.statics.fillables = ["name", "email", "password", "addresses", "role"];

userSchema.statics.response = {
	id: "$_id",
	name: "$name",
	email: "$email",
	addresses: "$addresses",
	role: "$role",
	createdAt: "$createdAt",
	updatedAt: "$updatedAt",
};

userSchema.statics.responseFields = Object.keys(userSchema.statics.response);

const User = mongoose.model("User", userSchema);

export default User;
