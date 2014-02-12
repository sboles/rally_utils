#!/usr/bin/env zsh

echo_and_run() {
    tput setaf 4
    echo "[local-update]: $@"
    tput sgr0
    "$@"
}

git_update() {
    TODAY=`date`
    echo_and_run git stash save --include-untracked "local-update auto stash at ${TODAY}"
    echo_and_run git checkout master
    echo_and_run git pull
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
git_update
echo_and_run rvm rvmrc load
echo_and_run npm install
echo_and_run grunt build


# update alm
echo_and_run export APPSDK_PATH=${HOME}/projects/appsdk
echo_and_run cd ~/projects/alm/alm-webapp
git_update
echo_and_run rvm rvmrc load
echo_and_run npm install
echo_and_run grunt build
echo_and_run buildr alm:data:clean
echo_and_run buildr clean jetty:run
