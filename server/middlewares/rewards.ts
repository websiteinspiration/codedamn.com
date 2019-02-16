import User from 'models/user'

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

export default function rewards(req, res, next) {
	next()

	if(!(req.session && req.session.auth)) {
		// unauth
		return
	}

	const user = req.session.user
	const today = formatDate(new Date())
	let streak = user.streak || 0

	if(user.activeDates.includes(formatDate(new Date().getTime() - 86400000))) {
		// yesterday was present, increment streak
		streak++
	} else {
		streak = 1
	}

	user.activeDates = [...new Set([...(user.activeDates || []), today])]
	User.setActiveDate(today, streak, user.username)
}