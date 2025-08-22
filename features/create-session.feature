Feature: Franchise schedules a class session
  As a gymFranchise operator
  I want to create/schedule class sessions (date, time, duration, maxCapacity, coach)
  So that sessions appear in the public catalog and members can book them

  Background:
    Given a fresh system
    And a franchise "DefaultFranchise" exists and is authenticated as "franchise-admin@example.com"
    And a coach "Coach A" exists for "DefaultFranchise"

  @happy-path @create-session
  Scenario: Franchise schedules a session successfully
    Given a program "Yoga Basics" exists for "DefaultFranchise"
    When the franchise schedules a session for "Yoga Basics" with
      | startTime                    | 2025-09-01T10:00:00Z |
      | durationMinutes              | 60                  |
      | maxCapacity                  | 10                  |
      | coachName                    | Coach A             |
    Then a "SessionScheduled" event is persisted with program "Yoga Basics"
    And the public catalog for "DefaultFranchise" contains a session on "2025-09-01" with availableSeats 10

  @validation @create-session
  Scenario: Scheduling fails when required fields are missing
    Given a program "Pilates Intro" exists for "DefaultFranchise"
    When the franchise attempts to schedule a session for "Pilates Intro" with
      | startTime       | 2025-09-02T12:00:00Z |
      | durationMinutes | 45                   |
      # maxCapacity is omitted intentionally
    Then the API returns a validation error indicating "maxCapacity" is required
    And no "SessionScheduled" event is persisted

  @auth @create-session
  Scenario: Non-franchise user is forbidden from scheduling
    Given an authenticated user "alice@example.com" who is NOT a franchise admin
    When that user attempts to schedule a session for program "Yoga Basics"
    Then the API responds with 403 Forbidden
    And no session is created

  @coach-validation @create-session
  Scenario: Scheduling fails when assigned coach does not belong to the franchise
    Given a program "Spin 101" exists for "DefaultFranchise"
    And a coach "External Coach" exists but is NOT associated with "DefaultFranchise"
    When the franchise attempts to schedule a session for "Spin 101" assigning coach "External Coach" with
      | startTime       | 2025-09-03T09:00:00Z |
      | durationMinutes | 45                   |
      | maxCapacity     | 12                   |
    Then the API returns an error "Coach not found or not assigned to franchise"
    And no "SessionScheduled" event is persisted
