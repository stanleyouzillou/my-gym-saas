Feature: Franchise publishes programs and members book free classes
  Background:
    Given a fresh system seeded with a "DefaultFranchise" and a coach "Coach A"
    And an active member "Alice" exists for "DefaultFranchise"

  @publish
  Scenario: Franchise publishes a program and schedules a session
    Given the franchise creates a program "Yoga Basics"
    When the franchise schedules a session for "Yoga Basics" on "2025-09-01T10:00:00Z" with duration 60 and maxCapacity 10 assigned to "Coach A"
    Then the system persists a SessionScheduled event and the session appears in the public catalog

  @browse
  Scenario: Member browses upcoming sessions
    Given a scheduled session exists for "Yoga Basics" on "2025-09-01T10:00:00Z"
    When the member requests upcoming sessions for the franchise on "2025-09-01"
    Then the session list contains "Yoga Basics" with availableSeats 10

  @booking_happy
  Scenario: Member books a class with available seats
    Given a scheduled session exists with maxCapacity 2 and 1 current booking
    When member "Alice" requests booking for the session
    Then BookingCreated is emitted and member "Alice" sees a confirmed booking

  @waitlist
  Scenario: Member joins waitlist when session is full and gets promoted on cancellation
    Given a scheduled session exists with maxCapacity 1 and 1 current booking and a waitlist entry for "Bob"
    When member "Alice" requests booking for the session
    Then WaitlistEntryCreated is emitted for "Alice"
    When the existing booking is cancelled
    Then WaitlistPromoted is emitted for "Alice" and BookingCreated for "Alice"
