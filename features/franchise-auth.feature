Feature: Franchise dashboard authentication & authorization
  As a gymFranchise operator
  I want the franchise dashboard (/dashboard/franchise) to be protected by Clerk auth
  So only authenticated franchise admins can access franchise data

  Background:
    Given a fresh system
    And a franchise "DefaultFranchise" exists
    And a Clerk user "franchise-admin@example.com" exists and is assigned role "franchise_admin" for "DefaultFranchise"
    And a Clerk user "alice@example.com" exists with no franchise role

  @happy-path @auth
  Scenario: Franchise admin can access protected dashboard
    Given the client has a valid Clerk session token for "franchise-admin@example.com"
    When the client requests GET /dashboard/franchise
    Then the API responds 200 OK
    And the response contains "franchiseId":"DefaultFranchise"

  @unauthenticated @auth
  Scenario: Unauthenticated request is rejected
    Given the client has no session token
    When the client requests GET /dashboard/franchise
    Then the API responds 401 Unauthorized

  @forbidden @auth
  Scenario: Authenticated user without franchise role is forbidden
    Given the client has a valid Clerk session token for "alice@example.com"
    When the client requests GET /dashboard/franchise
    Then the API responds 403 Forbidden

  @token-expired @auth
  Scenario: Expired or invalid token is rejected
    Given the client has an expired or invalid Clerk session token
    When the client requests GET /dashboard/franchise
    Then the API responds 401 Unauthorized
