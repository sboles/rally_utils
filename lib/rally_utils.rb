require 'net/http'
module RallyUtils
  def self.post(url, cookie, form_hash)
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
  
  def self.get(url, cookie)
    uri = URI(url)
    req = Net::HTTP::Get.new(uri.request_uri)
    req['Cookie'] = cookie
    http = Net::HTTP.new(uri.host, uri.port)
    res = http.start do |http|
      http.request(req)
    end
    res
  end

  def self.login(username, password)
    auth_response = post('http://localhost:7001/slm/j_spring_security_check', nil, {'j_username' => username, 'j_password' => password})
    cookie = auth_response['Set-Cookie']
  end

  def self.create_subscription(cookie, admin_user, modules, type)
    create_form_response = get('http://localhost:7001/slm/admin/sp/new.sp?cpoid=1&projectScopeUp=false&projectScopeDown=true', cookie)
    key = create_form_response.body.match('SecurityToken.*content=\"(.*)\"')[1]
    form_string = {'key' => key, 'adminUser' => admin_user, 'password' => 'Password', 'password2' => 'Password', 'tagTypes' => modules, 'type' => type, 'unpaidSeats' => '-1'}
    response = post('http://localhost:7001/slm/admin/sp/edit/createAndClose.sp?cpoid=1&projectScopeUp=false&projectScopeDown=true', cookie, form_string)
    subscription_id = response.body.match('Subscription (\d+)')[1]
    return subscription_id
  end

  def self.switch_toggles(cookie, subscription_id, toggles)
    toggles.each do |toggle|
      form_string = {'value' => 'true', 'subscriptionID' => subscription_id, '_slug' => '/admin/togglefeatures', 'cpoid' => '1', 'projectScopeUp' => 'false', 'projectScopeDown' => 'true', 'name' => toggle}
      post('http://localhost:7001/slm/admin/tools/setSubscriptionToggle.sp', cookie, form_string)
    end
  end

  #DSL
  def self.with_login (credentials)
    cookie = login(credentials[:username], credentials[:password])
    yield cookie
  end

  def self.create_subscription_with(cookie, config)
    subscription_id = create_subscription(cookie, config[:username], config[:modules], config[:subscription_type])
    switch_toggles(cookie, subscription_id, config[:toggles])
  end
end
