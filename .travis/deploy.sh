#!/bin/bash
set -e
pwd

git config --global push.default simple
git remote add production ssh://dev@$CODEDAMNIP/~/new-codedamn
git push --force production master # push our updates

ssh dev@$CODEDAMNIP 'screen -S backup -d -m `cd ~/new-codedamn/ && npm install && pm2 restart codedamn.com_new && exit`'