#!/usr/bin/env bash
./common.sh
wget http://download.jetbrains.com/idea/ideaIU-12.1.6.dmg
hdiutil mount ideaIU-12.1.6.dmg
cp -R /Volumes/IntelliJ\ IDEA\ 12/IntelliJ\ IDEA\ 12.app /Applications
hdiutil unmount /Volumes/IntelliJ\ IDEA\ 12
#open /Applications/IntelliJ\ IDEA\ 12.app
mv ~/Library/Preferences/IntelliJIdea12/idea.vmoptions ~/Library/Preferences/IntelliJIdea12/idea.vmoptions.$(date '+%Y-%m-%d_%H-%M-%S')
mkdir -p /Users/sboles/Library/Preferences/IntelliJIdea12/
echo '-Xms512m
-Xmx4000m
-XX:MaxPermSize=500m
-XX:ReservedCodeCacheSize=96m
-XX:+UseCodeCacheFlushing
-XX:+UseCompressedOops' >> ~/Library/Preferences/IntelliJIdea12/idea.vmoptions
rm ideaIU-12.1.6.dmg
