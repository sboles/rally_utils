require 'net/http'

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

def login(username, password)
  auth_response = post('http://localhost:7001/slm/j_spring_security_check', nil, {'j_username' => username, 'j_password' => password})
  cookie = auth_response['Set-Cookie']
end

def create_subscription(cookie, admin_user, modules)
  form_string = {'adminUser' => admin_user, 'password' => 'Password', 'password2' => 'Password', 'tagTypes' => modules}
  subscription_response = post('http://localhost:7001/slm/admin/sp/edit/createAndClose.sp?cpoid=1&projectScopeUp=false&projectScopeDown=true', cookie, form_string)
  subscription_id = subscription_response.body.match('Subscription (\d+)')[1]
end

def switch_toggles(cookie, subscription_id, toggles)
  toggles.each do |toggle|
    form_string = {'value' => 'true', 'subscriptionID' => subscription_id, '_slug' => '/admin/togglefeatures', 'cpoid' => '1', 'projectScopeUp' => 'false', 'projectScopeDown' => 'true', 'name' => toggle}
    post('http://localhost:7001/slm/admin/tools/setSubscriptionToggle.sp', cookie, form_string)
  end
end

# ADMIN_USER = ARGV[0] || 'test@test.com'
# ALM_MODULES = ARGV[1].split('|') || []
# TOGGLES = ARGV[2].split('|') || []
# 
# puts ADMIN_USER
# puts ALM_MODULES
# puts TOGGLES
# 
# cookie = login('slmadmin', 'w0rk$h0p')
# 
# subscription_id = create_subscription(cookie, ADMIN_USER, ALM_MODULES)
# 
# switch_toggles(cookie, subscription_id, TOGGLES)
