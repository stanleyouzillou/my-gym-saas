Feature: Sessions list for authenticated member
  As a member
  I want to view upcoming sessions
  So that I can choose a class to attend

  Background:
    Given I am an authenticated member of tenant "DefaultFranchise"
    And upcoming sessions exist for my tenant

  Scenario: See upcoming sessions with capacity info
    When I navigate to the sessions page
    Then I see a list of upcoming sessions
    And each session shows start time, coach, and remaining capacity
