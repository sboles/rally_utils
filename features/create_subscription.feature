Feature: Create a subscription

  Scenario: Create a subscription with modules
    When I log into ALM with username slmadmin with password w0rk$h0p
    Then I can create a subscription with admin username test@test.com and modules 'Rally Portfolio Manager'|'Rally Quality Manager'

  Scenario: Toggle on toggles
    When I log into ALM with username slmadmin with password w0rk$h0p
    Then I can toggle on 'ENABLE_BULK_EDIT_OF_ALL_FIELDS'|'PROVISION_TRIAL_AND_COMMUNITY_IN_PROD'

