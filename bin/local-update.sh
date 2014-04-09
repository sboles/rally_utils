#!/usr/bin/env zsh

if [[ $# != 4 ]]; then
    echo 'ERROR! All four arguments are required'
    echo 'usage: local-update.sh <newBranchName> <appsdk commit> <app-catalog commit> <alm-webapp commit>'
    exit 1;
fi

COMMIT=master
BRANCHNAME=$1

echo_and_run() {
    tput setaf 4
    echo "[local-update]: $@"
    tput sgr0
    "$@"
}

git_update() {
    TODAY=`date`
    echo_and_run git stash save --include-untracked "local-update auto stash at ${TODAY}"
    echo_and_run git fetch
    if [[ $# == 1 ]]
    then
        echo_and_run git checkout -b $1 $COMMIT
    else
        echo_and_run git checkout master
        echo_and_run git merge origin/master
    fi
}

if [[ -s "$HOME/.rvm/scripts/rvm" ]] ; then

  # First try to load from a user install
  source "$HOME/.rvm/scripts/rvm"

fi



# update oh-my-zsh-custom
echo_and_run cd ~/.oh-my-zsh-custom
git_update
echo_and_run rvm rvmrc load


# update appsdk
echo_and_run cd ~/projects/appsdk
COMMIT=$2
git_update $BRANCHNAME
echo_and_run rvm rvmrc load
echo_and_run npm install
echo_and_run grunt build


# update app-catalog
echo_and_run cd ~/projects/app-catalog
COMMIT=$3
git_update $BRANCHNAME
echo_and_run rvm rvmrc load
echo_and_run npm install
echo_and_run grunt build


# update alm
echo_and_run export APPSDK_PATH=${HOME}/projects/appsdk
echo_and_run export APPCATALOG_PATH=${HOME}/projects/app-catalog
echo_and_run cd ~/projects/alm/alm-webapp
COMMIT=$4
git_update $BRANCHNAME
echo_and_run rvm rvmrc load
echo_and_run npm install
echo_and_run grunt build
echo_and_run buildr db:migrations
echo_and_run buildr clean jetty:run
