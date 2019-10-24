#!/usr/bin/env bash

set -eo pipefail

git config user.name "$GH_USER_NAME"
git config user.email "$GH_USER_EMAIL"

git checkout master
git submodule update --remote --merge -- _posts
git add _posts
git commit -m "feat: Update posts"
git push origin master

echo "Posts updated successfully"