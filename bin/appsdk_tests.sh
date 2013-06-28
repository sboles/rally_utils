#!/bin/sh

[ "$#" -eq 1 ] && osascript -e "tell application \"Terminal\" to do script \"cd ~/projects/appsdk && bundle exec rake test:conf jsspec=$1\""
osascript -e 'tell application "Terminal" to do script "cd ~/projects/appsdk && bundle exec rake jasmine JASMINE_PORT=8888"'
osascript -e 'tell application "Terminal" to do script "cd ~/projects/appsdk && bundle exec guard "'
osascript -e 'tell application "Terminal" to do script "cd ~/projects/alm/alm-webapp && buildr selenium:rc:stop && buildr selenium:rc:start && open http://localhost:5445/wd/hub/ && exit"'

