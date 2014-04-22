#!/usr/bin/env zsh

if [[ $# != 4 ]]; then
    echo 'ERROR! All four arguments are required'
    echo 'usage: branch-repos.sh <newBranchName> <appsdk commit> <app-catalog commit> <alm-webapp commit>'
    exit 1;
fi

BRANCHNAME=$1

echo_and_run() {
    tput setaf 4
    echo "[branch-repos]: $@"
    tput sgr0
    "$@"
}

git_update() {
    echo_and_run cd $1
    TODAY=`date`
    echo_and_run git stash save --include-untracked "branch-repos auto stash at ${TODAY}"
    echo_and_run git fetch
    if [[ $# == 3 ]]
    then
        echo_and_run git checkout -b $2 $3
    else
        echo_and_run git checkout master
        echo_and_run git merge origin/master
    fi
}


git_update ~/projects/appsdk $BRANCHNAME $2

git_update ~/projects/app-catalog $BRANCHNAME $3

git_update ~/projects/alm/alm-webapp $BRANCHNAME $4