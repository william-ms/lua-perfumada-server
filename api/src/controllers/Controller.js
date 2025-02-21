export default class Controller {
	static get model() {
		return this.name.replace(/Controller$/, "");
	}

	success(res, data, statusCode = 200) {
		return res.status(statusCode).json(data);
	}

	error(res, message, statusCode = 500) {
		return res.status(statusCode).json({
			error: message,
		});
	}

	/**
	 * Centralized error handling
	 */
	handleErrors(error, res) {
		console.error("Erro:", error);

		// Mongoose validation errors
		if (error.name === "ValidationError") {
			const errors = Object.values(error.errors).map((err) => err.message);
			return this.error(res, errors, 400);
		}

		// Duplicate key error (ex: unique index)
		if (error.code === 11000) {
			return this.error(res, "Duplicate registration", 400);
		}

		// Generic error
		return this.error(res, "Internal server error");
	}

	async index(req, res) {
		try {
			const data = await this.constructor.model.find();
			this.success(res, data);
		} catch (error) {
			this.handleErrors(error, res);
		}
	}

	async show(req, res) {
		try {
			const data = await this.constructor.model.findById(req.params.id);
			if (!data) return this.error(res, "Record not found", 404);
			this.success(res, data);
		} catch (error) {
			this.handleErrors(error, res);
		}
	}

	async store(req, res) {
		try {
			const newItem = new this.constructor.model(req.body);
			const data = await newItem.save();
			this.success(res, data, 201);
		} catch (error) {
			this.handleErrors(error, res);
		}
	}

	async update(req, res) {
		try {
			const data = await this.constructor.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
			if (!data) return this.error(res, "Record not found", 404);
			this.success(res, data);
		} catch (error) {
			this.handleErrors(error, res);
		}
	}

	async delete(req, res) {
		try {
			const data = await this.constructor.model.findByIdAndDelete(req.params.id);
			if (!data) return this.error(res, "Record not found", 404);
			this.success(res, data);
		} catch (error) {
			this.handleErrors(error, res);
		}
	}
}
