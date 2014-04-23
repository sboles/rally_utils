#! /bin/bash

echo_and_run() {
    tput setaf 4
    echo "[git-repos]: $@"
    tput sgr0
    $@
}

git_command() {
    echo_and_run cd $1

    if ! git diff-index --quiet HEAD --; then
        echo_error "ERROR! There are pending changes in $1"
        exit
    fi

    echo_and_run git ${@:2}
}

echo_error() {
    tput setaf 1
    echo $1
    tput sgr0
}



if [[ $# < 1 ]]; then
    echo_error 'ERROR! At least 4 arguments are required'
    echo_error 'git-repos.sh [--greens <appsdk commit> <app-catalog commit> <alm-webapp commit>] <git-command>...'
    exit 1;
fi

COMMITS=""
if [[ $1 = "--greens" ]]; then
    COMMITS=(${@:2:4})
    GIT_COMMANDS=${@:5}
else
    GIT_COMMANDS=${@:1}
fi

REPO_DIRS=(~/projects/appsdk ~/projects/app-catalog ~/projects/alm/alm-webapp)


i=0
for DIR in ${REPO_DIRS[@]}
do
    git_command $DIR $GIT_COMMANDS ${COMMITS[$i]}
    let "i += 1"
done