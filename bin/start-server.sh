#!/usr/bin/env zsh

echo_and_run() {
    tput setaf 4
    echo "[start-server]: $@"
    tput sgr0
    "$@"
}

if [[ -s "$HOME/.rvm/scripts/rvm" ]] ; then

  # First try to load from a user install
  source "$HOME/.rvm/scripts/rvm"

fi


# update oh-my-zsh-custom
echo_and_run cd ~/.oh-my-zsh-custom
echo_and_run git pull
echo_and_run rvm rvmrc load


echo_and_run export APPSDK_PATH=${HOME}/projects/appsdk
echo_and_run export APP_CATALOG_PATH=${HOME}/projects/app-catalog


# update appsdk
echo_and_run cd ~/projects/appsdk
echo_and_run rvm rvmrc load
echo_and_run npm install
echo_and_run grunt build


# update app-catalog
echo_and_run cd ~/projects/app-catalog
echo_and_run rvm rvmrc load
echo_and_run npm install
echo_and_run grunt build


# update alm
echo_and_run cd ~/projects/alm/alm-webapp
echo_and_run rvm rvmrc load
echo_and_run npm install
echo_and_run grunt build
echo_and_run ./gradlew clean
echo_and_run ./gradlew dbMigrations
echo_and_run ./gradlew corra 
