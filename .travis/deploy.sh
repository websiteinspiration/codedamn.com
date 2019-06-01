#!/bin/bash
set -e
pwd

rm -rf .git
rm -rf .gitignore
mv .gitignore_travis .gitignore
git init .
git add .
git commit -m "Deploying"
git remote add production ssh://root@$CODEDAMNIP/~/codedamn
git push --force production master # push our updates

ssh root@$CODEDAMNIP "cd ~/codedamn/ && npm install && pm2 restart codedamn.com && exit"