#!/bin/bash
set -e
pwd
rm .gitignore
mv .gitignore_travis .gitignore
rm -rf .git
git init
git add .
git commit -m "Deploying"
git config --global push.default simple
git remote add production ssh://dev@$CODEDAMNIP/~/new-codedamn
git push production master # push our updates