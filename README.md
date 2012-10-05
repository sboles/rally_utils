# Development shims while working at Rally

## Installation
In your Gemfile:

* `gem 'rally_utils', :git => 'git://github.com/sboles/rally_utils.git'`

## Create Subscriptions
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
* Run `create_subscriptions`

## Better Rally
Better Rally is a Google Chrome extension that filters out the noise when using Rally. 

## Installation
* Clone this project
* Enable developer mode in Chrome
* Load Unpacked Extension and select `extensions/better_rally`

## git-branches
A shell script to list branches with the authors of the last commit. A name can be supplied 
to find all branches where the last commit's author string includes the name.

* git-branches - list all branches with the last commit author
* git-branches "string" - list all branches that include 'string' in the last commit author string   

