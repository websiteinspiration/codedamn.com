#!/bin/bash
cd ~/codedamn/codedamn.com
echo "INSIDE codedamn.com DIRECTORY"
echo "Fetching git repo now"
# test coment
path=$(pwd)

if [ $path == "/home/dev/codedamn/codedamn.com" ]; then
	git fetch origin master
	git reset --hard origin/master
	npm install
	npm run wp-prod
	pm2 restart codedamn.com --update-env
fi