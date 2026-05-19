# Security Specification - KIDS EXPO 2026

## Data Invariants
- `registrations`: Every document must have `name`, `email`, `phone`, `type`, and `createdAt`.
- `type` must be one of `['exhibitor', 'visitor']`.
- `createdAt` must be the server time.

## The Dirty Dozen Payloads
1. Create registration with missing `name`.
2. Create registration with invalid `type` (e.g., 'admin').
3. Create registration with client-side `createdAt` set to the past.
4. Create registration with an extra `isVerified` field.
5. Update an existing registration (should be forbidden).
6. Delete a registration (should be forbidden).
7. List all registrations as an unauthenticated user (should be forbidden).
8. Put a 1MB string into the `name` field.
9. Inject malicious characters into the document ID.
10. Read someone else's registration by ID.
11. Create a registration with a very long email string.
12. Create a registration with a non-string `phone` value.

## Test Runner Plan
- Use `firestore.rules.test.ts` to verify these scenarios.
