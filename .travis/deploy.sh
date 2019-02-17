#!/bin/bash
set -e
git config --global push.default simple
git remote add production ssh://dev@$CODEDAMNIP/~/new-codedamn
git push production master # push our updates