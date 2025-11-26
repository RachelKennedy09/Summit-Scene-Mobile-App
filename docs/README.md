1. Beggining of app h aving troubles with getting tabs on the app without errors. Tried to organize screens right off the bat and keep out of App.js but kept getting errors. I had Co -pilot navigate and do the files myself and some how fixed the errors after fighting with it for a long time.??
2. In my proposal I said I would use ticketmaster API possibly. Summit Scene is different because it targets small towns, bigger APIs don't do that. So I stuck with my own API and researched my own data of REAL events coming up in Banff, Lake Louise, Canmore that only i could research.
3. Most real apps start this way behind the scenes:

   a content team or admin panel where humans add stuff,
   a database,
   an API that serves it to users.

I am just doing the same, solo:

I am the content team.
MongoDB = database.
Express API = backend.
Expo app = frontend client.

- challenge: I thought I should put all files into an app folder and then all into a server folder, but it caused a lot of errors and was going into unknown territory. I later learned the way I had it was correct and still a normal way to build an app.
- - wasnt as organized with my commits as I usually am. files were a bit mixxed together when commiting

- used modern ES module for server side.

using thunderclient for db testing easier to use than postman and right at my fingertips.

- early on in my projectonce i got to backend, the hubscreen file was already at 400 lines of code, i started seperating into components right away. I am gglad for this as now it is a habbit at the beginning instead of the end. (Thank you to my professor)

Authentication & Security Overview

SummitScene uses JWT-based authentication to provide a secure and modern login system for mobile users. This ensures all protected actions (such as posting events) can only be performed by verified users.






### This section outlines how registration, login, session persistence, and logout work in the app.

1. Registration Flow (POST /api/auth/register)
   Goal: Create a new user account and issue a JWT.
   Flow:
   User enters name, email, password in the Register screen.
   The mobile app sends a JSON request to:
   POST /api/auth/register
   On the server:
   Validates email + password.
   Ensures email is not already taken.
   Uses bcrypt to hash the password.
   Stores the user in MongoDB (email, passwordHash, name, createdAt).
   Generates a JWT with a 24h expiration:
   jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" })

Server returns:

{
"token": "<jwt>",
"user": {
"id": "...",
"email": "...",
"name": "...",
"createdAt": "..."
}
}

App stores the token in AsyncStorage and sets the user in AuthContext.
UI switches automatically to the authenticated area (Tabs).

2. Login Flow (POST /api/auth/login)
   Goal: Authenticate an existing user and issue a new JWT.
   Flow:
   User enters email + password.
   Mobile app calls:
   POST /api/auth/login

On the server:
Finds user by email.
Checks password using bcrypt.compare.
If valid: issues a new JWT with 24h lifespan.
App saves:
authToken → AsyncStorage
user → AuthContext
UI switches to the main app (Tabs).

3. Automatic Session Restore (GET /api/auth/me)
   Goal: Keep the user logged in across app restarts as long as their token is valid.
   Flow at app startup:
   AuthContext runs restoreSession().
   App checks AsyncStorage for authToken.
   If token exists:
   App sends:
   GET /api/auth/me
   Authorization: Bearer <token>

authMiddleware verifies the token:
Checks signature
Checks expiration (whichever time i end up using)
Extracts userId

Server responds with user info:

{
"id": "...",
"email": "...",
"name": "...",
"createdAt": "..."
}

App restores the session and shows the authenticated tabs.
If token is expired:
/auth/me returns 401
App clears the token
User is returned to Login screen

4. Logout Flow
   Goal: Clear local session & return to authentication screens.
   Flow:
   User taps Log Out on the Account tab.
   App calls logout() inside AuthContext, which:
   Clears user from state
   Clears token from state
   Removes authToken from AsyncStorage
   Because user === null, RootNavigator automatically switches back to the AuthStack (Login/Register screens).

5. Why JWT? Why Middleware?
   JWT allows stateless authentication — no session storage needed.
   Expiration (...h) protects user accounts.
   authMiddleware enforces:
   Token present?
   Token valid?
   Token expired?
   If valid → attach req.user.userId for secure operations.
   This system gives SummitScene a professional, scalable auth architecture.




Flo of App.js , RootNavigator and AuthContext
AuthContext (AuthProvider)
   │
   │  exposes { user, token, isAuthLoading, login, register, ... }
   ▼
RootNavigator (useAuth)
   ├─ if (isAuthLoading) → AuthLoadingScreen
   ├─ if (!user) → Login/Register stack
   └─ if (user) → tabs + MyEvents + EventDetail + Community screens
         │
         └─ TabNavigator (useAuth again)
              └─ if user.role === "business" → show Post tab
