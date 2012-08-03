require 'net/http'

ADMIN_USER = ARGV[0] || 'test@test.com'
ALM_MODULES = ARGV[1].split('|') || []
TOGGLES = ARGV[2].split('|') || []

puts ADMIN_USER
puts ALM_MODULES
puts TOGGLES

def post(url, cookie, form_hash)
  uri = URI(url)
  req = Net::HTTP::Post.new(uri.request_uri)
  req['Cookie'] = cookie
  req.set_form_data(form_hash)
  http = Net::HTTP.new(uri.host, uri.port)
  res = http.start do |http|
    http.request(req)
  end
  res
end

auth_response = post('http://localhost:7001/slm/j_spring_security_check', nil, {'j_username' => 'slmadmin', 'j_password' => 'w0rk$h0p'})
cookie = auth_response['Set-Cookie']

form_string = {'adminUser' => ADMIN_USER, 'password' => 'Password', 'password2' => 'Password', 'tagTypes' => ALM_MODULES}
subscription_response = post('http://localhost:7001/slm/admin/sp/edit/createAndClose.sp?cpoid=1&projectScopeUp=false&projectScopeDown=true', cookie, form_string)
subscription_id = subscription_response.body.match('Subscription (\d+)')[1]
subscription_oid = subscription_response.body.match('subscription.*(\/+)(\d+)\.js')[2]

TOGGLES.each do |toggle|
  form_string = {'value' => 'true', 'subscriptionID' => subscription_id, '_slug' => '/admin/togglefeatures', 'cpoid' => '1', 'projectScopeUp' => 'false', 'projectScopeDown' => 'true', 'name' => toggle}
  post('http://localhost:7001/slm/admin/tools/setSubscriptionToggle.sp', cookie, form_string)
end
