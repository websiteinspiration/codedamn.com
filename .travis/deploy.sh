#!/bin/bash
set -e
pwd

rm -rf .git
rm -rf .gitignore
mv .gitignore_travis .gitignore
git init .
git add .
git commit -m "Deploying"
git remote add production ssh://dev@$CODEDAMNIP/~/new-codedamn
git push --force production master # push our updates

ssh dev@$CODEDAMNIP 
cd ~/new-codedamn/ 
npm install && pm2 restart codedamn.com_new
exit