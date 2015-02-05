# Development shims while working at Rally

## create_subscriptions
* Create a `subscriptions` file like the following:

```ruby
module RallyUtils
  SUBSCRIPTIONS = {}
  SUBSCRIPTIONS[:admin_username] = 'admin'
  SUBSCRIPTIONS[:admin_password] = 'pass'
  SUBSCRIPTIONS[:subscriptions] = [
    {
      :username => 'test@test.com',
      :modules => ['Rally Portfolio Manager', 'Rally Quality Manager'],
      :toggles => ['ENABLE_BULK_EDIT_OF_ALL_FIELDS', 'PROVISION_TRIAL_AND_COMMUNITY_IN_PROD']
    }
  ]
end
```
* Start your server
* Run `bin/create_subscriptions`
