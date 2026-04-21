1. Data Invariants:
   - A `project` must have a unique `id` and a `category`.
   - `profile` is a single document at `/config/profile`.
   - Only authenticated owners can modify any data.
   - Public reads are allowed for all data.

2. The "Dirty Dozen" Payloads:
   - Profile Update: Set `role` to a 5MB string.
   - Project Create: Missing `id` or `title`.
   - Project Create: Set `github` to a non-URL string with invalid characters.
   - Skill Update: Set `level` to 1000.
   - Delete: Try to delete `/config/profile` as unauthenticated user.
   - Unauthorized Write: Update project as an authenticated but non-owner user.
   - Identity Poisoning: Injecting malicious JS into `codeSnippet`.
   - Type Mismatch: Sending a number for `tech` array.
   - Shadow Field: Adding `isAdmin: true` to profile payload.
   - ID Injection: Creating a project with ID `../../etc/passwd`.
   - Temporal Integrity: Faking `updatedAt` for project.
   - Mass Projection: Modifying multiple profiles in one batch.

3. Test Runner: (Implementation in Phase 3)
