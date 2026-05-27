# Security Specification: RevEngineer Firestore Rules

## 1. Data Invariants
1. A user profile `/users/{userId}` can only be read or written by the authenticated owner (`request.auth.uid == userId`). No user profile data can be read or scraped by other users.
2. The user profile fields `userId` and `email` are immutable once set.
3. Subcollections (`signals`, `integrations`, `leads`) under `/users/{userId}` derive authorization strictly from the parent owner UID. Access is restricted to `request.auth.uid == userId`.
4. Verification: All write operations require a verified email (`request.auth.token.email_verified == true`).
5. Immutability: Standard metadata timestamps like `createdAt` cannot be modified after initial write. `updatedAt` on save must match server timestamp `request.time`.
6. Strict Keys: Any written payloads must conform exactly to known property keys without any orphan/shadow key injections (enforced by `affectedKeys().hasOnly(...)` during updates).
7. Path ID Hardening: Document ID path variables (e.g., `{userId}`, `{signalId}`, `{integrationId}`, `{leadId}`) must match secure path requirements: be strings under 128 characters, matching the alphanumeric regex `^[a-zA-Z0-9_\-]+$`.

---

## 2. The "Dirty Dozen" Payloads (Adversarial Scenarios)

### Payload 1: Identity Spoofing (Creating user profile of another UID)
*   **Target Path**: `/users/attacker_uid`
*   **Actor UID**: `victim_uid`
*   **Payload**: `{ "userId": "attacker_uid", "email": "victim@domain.com" }`
*   **Expected**: `PERMISSION_DENIED`

### Payload 2: Self-Assigned Privileges
*   **Target Path**: `/users/victim_uid`
*   **Actor UID**: `victim_uid` (unverified email)
*   **Payload**: `{ "userId": "victim_uid", "email": "victim@domain.com", "isAdmin": true }`
*   **Expected**: `PERMISSION_DENIED`

### Payload 3: PII Blanket Read (Snooping another client's leads)
*   **Target Path**: `/users/victim_uid/leads/any_lead_id`
*   **Actor UID**: `attacker_uid` (verified email)
*   **Expected**: `PERMISSION_DENIED`

### Payload 4: Invalid Document ID Poisoning (DOS character injection)
*   **Target Path**: `/users/victim_uid/leads/LEAD_ID_WITH_A_VERY_LONG_STRING_THAT_EXCEEDS_1000_CHARACTERS_FOR_RESOURCE_EXHAUSTION_ATTACKS`
*   **Actor UID**: `victim_uid`
*   **Payload**: `{ "company": "Malicious Corp", "outreachStatus": "Ready" }`
*   **Expected**: `PERMISSION_DENIED`

### Payload 5: Immutable Timestamp Spoofing (Forged createdAt)
*   **Target Path**: `/users/victim_uid`
*   **Actor UID**: `victim_uid`
*   **Operation**: Update (Attempting to modify `createdAt` to a legacy date)
*   **Payload**: `{ "createdAt": "2020-01-01T00:00:00Z" }`
*   **Expected**: `PERMISSION_DENIED`

### Payload 6: Shadow Update Field Injection (Injecting Ghost Fields)
*   **Target Path**: `/users/victim_uid/signals/s1`
*   **Actor UID**: `victim_uid`
*   **Payload**: `{ "score": 90, "unknownGhostField": "infiltrated" }`
*   **Expected**: `PERMISSION_DENIED` (affectedKeys must strictly limit keys)

### Payload 7: Update-Gap Unsigned State Shortcutting
*   **Target Path**: `/users/victim_uid/leads/lead-1`
*   **Actor UID**: `victim_uid`
*   **Payload**: `{ "intentScore": 500, "outreachStatus": "UNKNOWN_CRASH_STATE" }`
*   **Expected**: `PERMISSION_DENIED`

### Payload 8: Corrupting List Types (Injecting non-string into arrays)
*   **Target Path**: `/users/victim_uid`
*   **Actor UID**: `victim_uid`
*   **Payload**: `{ "targetPersonas": [ 12345, null ] }`
*   **Expected**: `PERMISSION_DENIED`

### Payload 9: Unsigned Client Rule Bypassing (Read without filter)
*   **Target Path**: `/users/victim_uid/leads`
*   **Actor UID**: `attacker_uid`
*   **Operation**: Collection List / Query without filter
*   **Expected**: `PERMISSION_DENIED`

### Payload 10: Value Poisoning (Exceeding max character length constraint)
*   **Target Path**: `/users/victim_uid`
*   **Actor UID**: `victim_uid`
*   **Payload**: `{ "companyDescription": "<10,000 character spam string>" }`
*   **Expected**: `PERMISSION_DENIED`

### Payload 11: Spoofed email address match with unverified email token
*   **Target Path**: `/users/victim_uid`
*   **Actor UID**: `victim_uid` (where email_verified corresponds to `false` in the token)
*   **Expected**: `PERMISSION_DENIED`

### Payload 12: Orphaned Subcollection Write (Write before user profile created)
*   **Target Path**: `/users/non_existent_uid/leads/lead-1`
*   **Actor UID**: `non_existent_uid` (where no profile has been registered yet)
*   **Expected**: `PERMISSION_DENIED`

---

## 3. Test Runner Definition: firestore.rules.test.ts

```typescript
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import * as fs from "fs";

let testEnv: RulesTestEnvironment;

describe("Firestore Security Rules Tests", () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "mystic-accumulator-05xj8",
      firestore: {
        rules: fs.readFileSync("firestore.rules", "utf8"),
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  it("should prevent non-authenticated users from reading any profiles", async () => {
    const context = testEnv.unauthenticatedContext();
    const db = context.firestore();
    await assertFails(db.doc("users/victim_uid").get());
  });

  it("should prevent attackers from reading other users' private lead data", async () => {
    const context = testEnv.authenticatedContext("attacker_uid", {
      email: "attacker@domain.com",
      email_verified: true,
    });
    const db = context.firestore();
    await assertFails(db.doc("users/victim_uid/leads/any_lead_id").get());
  });

  it("Payload 1: should prevent Identity Spoofing during profile creation", async () => {
    const context = testEnv.authenticatedContext("victim_uid", {
      email: "victim@domain.com",
      email_verified: true,
    });
    const db = context.firestore();
    await assertFails(
      db.doc("users/attacker_uid").set({
        userId: "attacker_uid",
        email: "victim@domain.com",
      })
    );
  });

  it("Payload 5: should reject timestamp tempering during profile updates", async () => {
    const context = testEnv.authenticatedContext("victim_uid", {
      email: "victim@domain.com",
      email_verified: true,
    });
    const db = context.firestore();
    
    // Set initial
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("users/victim_uid").set({
        userId: "victim_uid",
        email: "victim@domain.com",
        createdAt: new Date("2026-01-01T00:00:00Z"),
      });
    });

    await assertFails(
      db.doc("users/victim_uid").update({
        createdAt: new Date("2020-01-01T00:00:00Z"),
      })
    );
  });
});
```
