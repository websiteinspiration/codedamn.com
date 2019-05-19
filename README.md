# codedamn.com
This is the official repository of codedamn.com, i.e. the contents you see on codedamn.com are directly fetched from the master branch of this repo.

# How codedamn is built
codedamn is built on the top of Node v11.6, Express Framework, MongoDB, Mongoose and TypeScript

# How To Contribute?

- Fork the repo
- Clone the repo
- Do a `npm ci` in the main directory
- In the root directory (i.e. with .gitignore, package.json, etc. files) create a file named `.env`
- Paste and save the following content in it:
```
RECAPTCHA_SECRET="[hidden]"
COOKIE_SECRET="anythingrandomworkshere"
CAPTCHA_SITEKEY="6Lel8U8UAAAAAPZlTTEo6LRv2H59m-uN"
DEBUG="cd:*"
PORT="1337"
DB_CONNECTION_STRING="mongodb://localhost:27017/codedamn"
FACEBOOK_ACCESS_TOKEN="[hidden]"
NODE_ENV="development"
FACEBOOK_APP_ID="[hidden]"
GOOGLE_AUD_ID="[hidden]"
GITHUB_SECRET="[hidden]"
MJ_API_PUBLICKEY="[hidden]"
MJ_API_PRIVATEKEY="[hidden]"
ZOHO_PASSWORD="[hidden]"
CODEDAMN_ENVIRONMENTS_CONFIGURED="true"
```
- You see, some blocks are `[hidden]` because they're server private variables. Please register your own applications and populate them in order for your development build to work correctly.
- For `RECAPTCHA_SECRET`, go [here](https://www.google.com/recaptcha/admin/create) and create a `reCaptcha v2` profile to work.
- Leave other `[hidden]` variables. You probably don't need them. If you do, open an issue and I'll see what we can do.
- Run `npm run dev-all` in your directory
- Wait for the development build to spin off.
- Visit `http://localhost:1400`
- Hot reloading is enabled by default. Have fun improving codedamn!

# Hall of Fame (HoF)
This list includes people I'm grateful as they contributed in development of codedamn. Want your name here? Do a significant PR (or some good PRs, or a lot of minor PRs) and get your name in codedamn's Hall of Fame

0. _Be the first one here_