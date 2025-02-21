export default function validateFields(fields, fieldsAllowed) {
	const invalidFields = fields.filter((field) => !fieldsAllowed.includes(field));

	if (invalidFields.length > 0) {
		throw new Error(`Fields not allowed: ${invalidFields.join(", ")}`);
	}
	return true;
}
