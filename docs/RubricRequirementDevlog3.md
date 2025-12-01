### Adding Backend Tests (Mocha/Chai/Supertest)

This week I implemented a backend test suite to verify the stability of the API and ensure my authentication, authorization, and community/event flows work correctly.

**Challenges:**

- Needed to export the Express app without interfering with the server's normal operation
- Had to adjust import styles (`chai` does not support default imports in ESM)
- Discovered that some routes required JWT authorization, so tests had to include `.set("Authorization", "Bearer <token>")`
- My `/api/community` endpoint returned validation errors until I matched the correct payload format

**Fixes:**

- Updated `index.js` to `export default app`
- Used named Chai exports (`import { expect } from "chai"`)
- Adjusted test payloads to match my controller validation rules
- Confirmed route protection works (local users cannot post events)

**Result:**
All tests are now passing.  
This shows that authentication, event fetching, authorization middleware, and community posting behave consistently and reliably.


Server Terminal Mocha/Chai test success
![alt text](image.png)