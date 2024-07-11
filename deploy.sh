#!/bin/bash

show_help() {
  echo "usage: ${me} [-r <path>] message"
  echo ""
  echo "   r    The local path to the deployment repo"
}

# The name of this script
me=`basename "$0"`

# The local path of the deploy repo
deploy_path="../gentlygently.github.io"

# Get options
if [ "$1" = "-r" ]; then
  deploy_path=$2
  commit_message=$3
else
  commit_message=$1
fi

# Validate params
if [ -z "$commit_message" ]; then
  echo "No commit message specified"
  echo ""
  show_help
  exit 1
fi

if [ ! -d "$deploy_path" ]; then
  echo "${deploy_path} does not exist"
  echo ""
  show_help
  exit 1
fi

npm run build || exit 1

cd "${deploy_path}" && git reset --hard && cd -|| exit 1
cd "${deploy_path}" && git pull && cd -|| exit 1
cd "${deploy_path}" && find . -maxdepth 1 ! -name '.git' ! -name '.' ! -name '..' -type f -exec rm -rf {} + && cd - || exit 1
cd "${deploy_path}" && find . -maxdepth 1 ! -name '.git' ! -name '.' ! -name '..' -type d -exec rm -rf {} + && cd - || exit 1
cp -R dist/. "${deploy_path}" || exit 1

cd "${deploy_path}" && git add * && cd - || exit 1
cd "${deploy_path}" && git commit -am "${commit_message}" && cd - || exit 1
cd "${deploy_path}" && git push && cd - || exit 1

echo ""
echo "Done"

