export default function mountProjection(model, fields = model.responseFields) {
	const projection = {};

	projection._id = 0;

	for (const key in model.response) {
		if (fields.includes(key)) {
			projection[key] = model.response[key];
		}
	}

	return projection;
}
