#!/bin/bash

if [ $# == 1 ]; then
  BRANCH_NAME=$1
fi

if [ ! -e "$BRANCH_NAME" ] && [[ "$BRANCH_NAME" == "" ]]; then
  BRANCH_NAME=$(git branch | grep "*" | sed "s/* //")
fi
echo "branch is $BRANCH_NAME"

if [[ "$BRANCH_NAME" == *master* ]]; then
  echo "you should be testing a branch other than master"
  exit 1
fi

curl -d "json=%7B%22parameter%22%3A+%5B%7B%22name%22%3A+%22SENCHA_PATH%22%2C+%22value%22%3A+%22%2Fopt%2FSenchaSDKTools-2.0.0-beta3%22%7D%2C+%7B%22name%22%3A+%22GIT_BRANCH%22%2C+%22value%22%3A+%22$BRANCH_NAME%22%7D%5D%7D" http://alm-build:8080/hudson/view/\~crazytrain/job/crazytrain-alm-java-js/build\?delay\=0sec

curl -d "json=%7B%22parameter%22%3A+%5B%7B%22name%22%3A+%22NUMBER_OF_THREADS%22%2C+%22value%22%3A+%2222%22%7D%2C+%7B%22name%22%3A+%22SELENIUM_HOST%22%2C+%22value%22%3A+%22localhost%22%7D%2C+%7B%22name%22%3A+%22SELENIUM_PORT%22%2C+%22value%22%3A+%225445%22%7D%2C+%7B%22name%22%3A+%22VERIFY_SOLR_INDEX_EMPTY%22%2C+%22value%22%3A+%22true%22%7D%2C+%7B%22name%22%3A+%22BROWSER%22%2C+%22value%22%3A+%22firefox%22%7D%2C+%7B%22name%22%3A+%22CHROME_VERSION%22%2C+%22value%22%3A+%2218%22%7D%2C+%7B%22name%22%3A+%22FIREFOX_VERSION%22%2C+%22value%22%3A+%2211.0%22%7D%2C+%7B%22name%22%3A+%22CAPTURE_SCREENSHOTS%22%2C+%22value%22%3A+%22true%22%7D%2C+%7B%22name%22%3A+%22CAPTURE_VIDEOS%22%2C+%22value%22%3A+%22false%22%7D%2C+%7B%22name%22%3A+%22USE_LAST_SUCCESSFUL_BUILD%22%2C+%22value%22%3A+%22false%22%7D%2C+%7B%22name%22%3A+%22LAST_SUCCESSFUL_BRANCH%22%2C+%22value%22%3A+%22master%22%7D%2C+%7B%22name%22%3A+%22GIT_BRANCH%22%2C+%22value%22%3A+%22$BRANCH_NAME%22%7D%5D%7D" http://alm-build:8080/hudson/view/%7Ecrazytrain/job/crazytrain-alm-guitest/build?delay=0sec

exit 0
