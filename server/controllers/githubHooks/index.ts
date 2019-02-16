const spawn = require('child_process').spawn

const SECRET_TOKEN = process.env.GITHUB_SECRET

function validateSignature(payload, sha1) {
	const crypto = require('crypto')
	const shasum = crypto.createHmac('sha1', SECRET_TOKEN)
	shasum.update(JSON.stringify(payload))
	const digest = shasum.digest('hex')
	console.log(digest, 'is the digest')
	return digest === sha1
}

export default router => {
	console.log('registering internals update')
	router.post('/internals/update', (req, res) => {		
		
		const sha1 = (req.headers['x-hub-signature'] || "").split('sha1=')[1]		
		const isValidSignature = validateSignature(req.body, sha1)

		if(isValidSignature) {
			const ref = req.body.ref

			if(ref === "refs/heads/master") {
				// master branch update. Fire off bash script

				console.log("Master updated. Running shell script")

				const ls = spawn('/bin/bash', [__dirname+'/update.sh'])

				ls.stdout.on('data', function (data) {
					console.log('stdout: ' + data.toString())
				})
				
				ls.stderr.on('data', function (data) {
					console.log('stderr: ' + data.toString())
				})
				
				ls.on('exit', function (code) {
					console.log('child process exited with code ' + code.toString())
				})
			}
			res.json({ status: 'ok' })
		}
	})
}