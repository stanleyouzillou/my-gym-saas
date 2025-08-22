Feature: Landing page CTA
  As a visitor
  I want to see a clear CTA to join
  So that I can start signup

  Scenario: Visitor sees CTA and can start signup
    Given I am an anonymous visitor
    When I open the landing page
    Then I see a "Join Now" call to action
    When I click the "Join Now" button
    Then I am taken to a fake checkout page
