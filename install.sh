#!/usr/bin/env bash --login
rm *.gem
gem build rally_utils.gemspec
gem uninstall -x rally_utils && gem install *.gem
rvm use --create --install ruby-1.8.7-p352@alm-webapp
gem uninstall -x rally_utils && gem install *.gem
