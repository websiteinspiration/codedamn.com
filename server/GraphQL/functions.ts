export function checkAuth({ req, throwOnUnAuth = true }): boolean {
	if(!(req.session && req.session.auth)) {
		if(throwOnUnAuth) {
			throw new Error('Unauthorized')
		}
		return false
	}

	return true
}

export function isLoggedIn(req): boolean {
	return req.session && req.session.auth
}