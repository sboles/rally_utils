Feature: Create a subscription

  Scenario: Create a subscription with modules
    When I retrieve username and password from subscriptions file
    And I log into ALM
    Then I can create a subscription with admin username test@test.com and modules 'Rally Portfolio Manager'|'Rally Quality Manager'

  Scenario: Toggle on toggles
    When I retrieve username and password from subscriptions file
    And I log into ALM
    Then I can toggle on 'ENABLE_BULK_EDIT_OF_ALL_FIELDS'|'PROVISION_TRIAL_AND_COMMUNITY_IN_PROD'

