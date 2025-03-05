const csrfMiddleware = (req, res, next) => {
	const csrfTokenCookie = req.cookies["XSRF-TOKEN"];
	const csrfTokenRequest = req.get("X-CSRF-Token") || req.body.csrfToken;

	if (!csrfTokenCookie || !csrfTokenRequest) {
		return res.status(403).json({ error: "CSRF token não fornecido ou inválido" });
	}

	if (csrfTokenCookie !== csrfTokenRequest) {
		return res.status(403).json({ error: "CSRF token não fornecido ou inválido" });
	}

	next();
};

export default csrfMiddleware;
