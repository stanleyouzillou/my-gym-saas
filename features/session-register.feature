Feature: Member registers for a session with capacity rules
  As a member
  I want to register for a session
  So that I can attend or be added to the waitlist when full

  Background:
    Given I am an authenticated member of tenant "DefaultFranchise"

  Scenario: Booking succeeds when capacity available
    Given a session exists with remaining capacity
    When I register for the session
    Then I have a Booking with status "BOOKED"

  Scenario: Waitlist when session is full
    Given a session exists that is full at max capacity
    When I register for the session
    Then I am placed on the waitlist for that session
