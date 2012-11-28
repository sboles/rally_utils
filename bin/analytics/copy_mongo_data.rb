#!/usr/bin/env ruby
require 'etc'
dbname=ARGV[0]
user = Etc.getlogin

unless dbname
  puts 'Must supply a testcluster database name (ex: test13cluster)'
  exit 1
end

system "mongo --eval \"db.copyDatabase('#{dbname}_analytics', '#{user}_analytics_dev', 'ateam-mongod1.f4tech.com')\""
(1..30).each do |i|
  from_database_name = "#{dbname}_analytics_rally_#{i}"
  to_database_name = "#{user}_analytics_dev_rally_#{i}"
  system "mongo --eval \"db.copyDatabase('#{from_database_name}', '#{to_database_name}', 'ateam-mongod1.f4tech.com')\""
end
