$LOAD_PATH << File.expand_path('../../lib', __FILE__)

require 'create_subscription.rb'

ADMIN_USER = ARGV[0] || 'test@test.com'
ALM_MODULES = ARGV[1].split('|') || []
TOGGLES = ARGV[2].split('|') || []

puts ADMIN_USER
puts ALM_MODULES
puts TOGGLES

cookie = login('slmadmin', 'w0rk$h0p')
subscription_id = create_subscription(cookie, ADMIN_USER, ALM_MODULES)
switch_toggles(cookie, subscription_id, TOGGLES)
