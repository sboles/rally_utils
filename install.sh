gem build rally_utils.gemspec
RALLY_UTILS_HOME=`pwd` && cd $WEBAPP_HOME && gem install $RALLY_UTILS_HOME/*.gem 
