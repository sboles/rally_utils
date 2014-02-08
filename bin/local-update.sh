#!/usr/bin/env zsh

echo_and_run() {
    tput setaf 4
    echo "[local-update]: $@"
    tput sgr0
    "$@"
}

git_update() {
    echo_and_run git add -A .
    echo_and_run git stash
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
APPSDK_PATH=~/projects/appsdk
echo_and_run cd ~/projects/alm/alm-webapp
git_update
echo_and_run rvm rvmrc load
echo_and_run npm install
echo_and_run grunt build
echo_and_run buildr alm:data:clean
echo_and_run buildr clean jetty:run
