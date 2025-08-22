Feature: Sync Clerk users into domain entities
  As a platform
  I want users created in Clerk to be reflected in our domain
  So the database has Tenants and Members consistent with identity roles

  Background:
    Given a fresh system

  @happy-path @member
  Scenario: New member user is created in Clerk
    Given a Clerk user exists with email "member1@example.com" and role "member" for tenant "DefaultFranchise"
    When the system processes the Clerk user sync
    Then a Tenant named "DefaultFranchise" exists
    And a Member exists with email "member1@example.com" under tenant "DefaultFranchise"

  @admin
  Scenario: Franchise admin is created in Clerk
    Given a Clerk user exists with email "owner@example.com" and role "franchise_admin" for tenant "NewFranchise"
    When the system processes the Clerk user sync
    Then a Tenant named "NewFranchise" exists
    And no Member is created for "owner@example.com"
