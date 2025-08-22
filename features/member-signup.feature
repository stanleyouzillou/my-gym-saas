Feature: Member signup via fake checkout
  As a visitor
  I want to sign up with a fake checkout
  So that I become a Member and can access sessions

  Scenario: Successful fake checkout with mock payment activates membership
    Given I am on the fake checkout page
    When I submit my details:
      | email           | valid.user@example.com |
      | firstName       | Valid                  |
      | lastName        | User                   |
      | tenantName      | DefaultFranchise       |
    Then I receive a login link or token
    And I am taken to the payment page
    When I confirm the payment
    Then membership is activated
    And I can access the sessions list

  Scenario: Paid member already ACTIVE is routed to sessions after sign-in
    Given a Clerk user exists with email "paid.active@example.com" and role "member" for tenant "DefaultFranchise"
    And the member status is "ACTIVE"
    When the user signs in
    Then the user is redirected to the sessions page
