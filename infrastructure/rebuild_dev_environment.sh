#!/bin/bash

# requires write permission to /rally
mkdir /rally/tools
rm /rally/tools/grails
rm -rf /rally/tools/grails-2.2.0*
curl http://dist.springframework.org.s3.amazonaws.com/release/GRAILS/grails-2.2.0.zip > /rally/tools/grails-2.2.0.zip
unzip /rally/tools/grails-2.2.0.zip -d /rally/tools
rm /rally/tools/grails
ln -s /rally/tools/grails-2.2.0 /rally/tools/grails

