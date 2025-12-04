## Running the Project Locally

You can run both the backend and mobile client locally if desired.

### 🔧 1. Clone the repository

`git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git`

`cd SummitSceneMobileApp`

### 2. Set up the Backend (Node + Express)

`cd server`

`npm install`

Create a `.env` file inside `server/`: (See .env.example)

Start the server

`npm start`

You should see:

"connected to MongoDB

SummitScene API listening on port 4000"

### 3. Run the Mobile App (Expo)

Open a second terminal:

`cd ..
npm install
expo start`

Scan the QR code with your phone or run on an emulator.

By default the app uses:

**API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL
|| "https://summit-scene-backend.onrender.com"**

To use your local backend, run Expo with:

`EXPO_PUBLIC_API_BASE_URL="http://YOUR_LOCAL_IP:4000" expo start`

### 4. Production Deployment

The backend is deployed on Render, and the mobile app is published on Expo, allowing anyone to test without local setup.

(Links included below)

https://summit-scene-backend.onrender.com

## Architecture

### High-Level Architecture Diagram

               ┌────────────────────────────┐
               │    React Native App       │
               │        (Expo)             │
               │  - Hub / Map / Post       │
               │  - Community / Account    │
               └────────────┬──────────────┘
                            │
                            │  HTTPS (fetch, JSON)
                            ▼
               ┌────────────────────────────┐
               │   Node.js + Express API    │
               │        (Render)            │
               │  Routes:                   │
               │   - /api/auth              │
               │   - /api/events            │
               │   - /api/community         │
               │                            │
               │  Middleware:               │
               │   - authMiddleware         │
               │   - isBusiness             │
               └────────────┬──────────────┘
                            │
                            │  Mongoose (ODM)
                            ▼
               ┌────────────────────────────┐
               │      MongoDB Atlas         │
               │  Collections:              │
               │   - users                  │
               │   - events                 │
               │   - communityposts         │
               └────────────────────────────┘

### Folder Structure

```text
SummitSceneMobileApp/
├── App.js
├── app.json
├── package.json
├── assets/
│   ├── logo.png
│   ├── splash.png
│   ├── icon.png
│   ├── adaptive-icon.png
│   └── favicon.png
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.js
│   │   └── RegisterScreen.js
│   ├── hub/
│   │   └── HubScreen.js
│   ├── map/
│   │   └── MapScreen.js
│   ├── events/
│   │   ├── PostEventScreen.js
│   │   ├── EditEventScreen.js
│   │   ├── EventDetailScreen.js
│   │   └── MyEventsScreen.js
│   ├── community/
│   │   ├── CommunityScreen.js
│   │   ├── CommunityPostScreen.js
│   │   └── EditCommunityPostScreen.js
│   └── account/
│       ├── AccountScreen.js
│       └── EditProfileScreen.js
│
├── components/
│   ├── account/
│   │   ├── AccountHeaderCard.js
│   │   ├── ProfileCard.js
│   │   ├── ThemeSection.js
│   │   └── MemberProfileModal.js
│   ├── cards/
│   │   ├── EventCard.js
│   │   └── CommunityPostCard.js
│   ├── events/
│   │   ├── EventHostSection.js
│   │   ├── EventOwnerSection.js
│   │   ├── DatePickerModal.js
│   │   └── TimePickerModal.js
│   ├── hub/
│   │   └── HubFilters.js
│   ├── map/
│   │   └── MapFilters.js
│   └── common/
│       └── SelectModal.js
│
├── navigation/
│   ├── RootNavigator.js
│   └── TabNavigator.js
│
├── context/
│   ├── AuthContext.js
│   └── ThemeContext.js
│
├── services/
│   ├── eventsApi.js
│   ├── communityApi.js
│   └── authApi.js
│
├── theme/
│   ├── colors.js
│   └── themes.js
│
└── server/
    ├── package.json
    ├── index.js
    ├── routes/
    │   ├── auth.js
    │   ├── events.js
    │   ├── community.js
    │   └── users.js
    ├── controllers/
    │   ├── eventController.js
    │   └── communityController.js
    ├── models/
    │   ├── User.js
    │   ├── Event.js
    │   └── CommunityPost.js
    ├── middleware/
    │   ├── auth.js
    │   └── isBusiness.js
    ├── test/
    │   └── api.test.js
    └── config/
        └── db.js
```

### SummitScene is a full-stack mobile application with three main layers and two user roles:


**Local users** – log in to browse events, use the map, read and create community posts (highway conditions, ride shares, event buddies).

**Business users** – have all local capabilities plus the ability to create and manage events.

1. **Mobile Client (React Native + Expo)**

   - Built with React Native and Expo.
   - Uses **tab navigation** for the main areas:
     - **Hub** – today’s featured events and quick filters(used by both locals and businesses).
     - **Map** – shows events as markers on a map for the selected date.
     - **Post Event** – lets business users create new events (locals see the tab differently or cannot post events ).
     - **Community** – highway conditions, ride shares, and event buddy posts(read/write for logged-in users).
     - **Account** – profile info, role (local or business), town, theme settings, and auth actions (login/logout).
   - Global state is handled via:
     - `AuthContext` – stores the logged-in user and JWT, handles login/logout, and exposes the user’s role ("local" or "business") so the UI can change behavior based on permissions.
     - `ThemeContext` – controls light/dark/other themes across the app, so all screens share a consistent look.
   - Network calls are isolated in **service files** (e.g. `eventsApi.js`) so screens don’t know about low-level fetch details.
   - Role-based UI logic:
     - The AuthContext provides the user object (including role), and screens/components use that to:
     - Show or hide business-only actions (like creating or editing events).
     - Let locals users only create/join community posts.
   - Network calls are isolated in service files (e.g. eventsApi.js, communityApi.js), so screens don’t deal with raw fetch details. This keeps components focused on rendering and interaction logic.

2. **API Server (Node.js + Express)**

   - The backend is built using Express and exposes a REST API under `/api`.
   - The architecture follows a **controller → middleware → model** pattern for clarity and maintainability.

     **Routes** are grouped by function:

     - `/api/auth`
       – user registration and login (returns JWT tokens for both locals and businesses)
     - `/api/events`
       – event CRUD for business users
       - `GET /api/events` – list events (for all logged-in users to browse).
       - `POST /api/events` – create events (**business-only**, protected by role middleware).
       - `PUT /api/events/:id` / `DELETE /api/events/:id` – update/remove events created by a business user.
     - `/api/community` – create/read community posts and replies.
       - `GET /api/community` – fetch community posts, filterable by type and town.
       - `POST /api/community` – create a new community post (available to logged-in locals and business users).
       - **Replies** – endpoint(s) to add replies to a specific post (e.g. `POST /api/community/:postId/replies`).
       - **Likes** – endpoint(s) to like or unlike a post (e.g. `POST` or `PATCH /api/community/:postId/like`), updating the post’s `likes` field.

   - **Middleware** is used to enforce security and business rules:

     - `authMiddleware` – verifies JWT tokens and attaches the authenticated user to `req.user`
     - `isBusiness` – checks that req.user.role === "business" before allowing event creation/editing routes to proceed.

   - **Controllers** handle the actual logic for each route
     (e.g., `eventsController.js`, `communityController.js`) and return
     structured JSON responses with appropriate HTTP status codes.

   - **Models (MongoDB + Mongoose)** define the database structure:

     - `User`, `Event`, and `CommunityPost`
     - Relationships use features like `populate()` so the frontend receives meaningful objects (e.g., post includes user name and town).

   - This setup ensures the backend is **secure, modular, and scalable**, matching industry-standard Node/Express architecture patterns.

3. **Database (MongoDB + Mongoose)**
   - Hosted in MongoDB.
   - Main collections:
     - `User` – stores user accounts (name, email, password hash, role "local" or "business", town, avatar, etc.).
     - `Event` – stores local events (title, category, town, date, time, description, createdBy).
     - `CommunityPost` – stores community posts and replies (type, town, body, user, likes, replies).
   - Uses Mongoose models and schemas for validation and relationships:
     - Community posts can `populate("user", "name email role town")` so the frontend can show who posted.
     - Events reference the User that created them (business accounts).

**Data Flow Example: Creating an Event**

1. A logged-in business user fills out the “Post Event” form in the mobile app.
2. The client calls `createEvent` in `eventsApi.js`, which sends a `POST /api/events` request with the JWT in the `Authorization` header.
3. `authMiddleware` verifies the token and attaches the `userId` and `role` to `req.user`.
4. `isBusiness` checks that `req.user.role` is `"business"` and only then allows the request to continue.
5. The events controller validates the payload, saves an `Event` document in MongoDB, and returns the new event.
6. The frontend updates the UI so the user sees their event in the Hub and Map screens.

**Data Flow Example 2: Local User Browsing and Posting in Community**

1. A logged-in local user opens the **Community** tab and selects a post type (e.g., “Highway Conditions”) and town.
2. The mobile app calls `GET /api/community?type=highwayconditions&town=Banff`.
3. The community controller builds a MongoDB query based on `type` and `town`, fetches matching `CommunityPost` documents, and uses `populate("user", "name town")` so each post shows who wrote it.
4. The mobile app renders a list of posts, each showing the author’s name, town, type, timestamp, and content.
5. If the user creates a new post, the app sends `POST /api/community` with the body, type, and town plus the user’s JWT.
6. `authMiddleware` checks the token, attaches the `userId`, and the controller saves a new `CommunityPost` linked to that user.

## 🧰 Tech Stack

### Frontend (Mobile Client)

- **React Native** with **Expo**
  - Cross-platform mobile app targeting Android and iOS.
- **React Navigation**
  - Bottom tab navigator for the main sections: Hub, Map, Post, Community, Account.
  - Stack navigation for deeper screens (event details, edit screens, etc.).
- **Context API**
  - `AuthContext` for storing the logged-in user, JWT, and role (`"local"` or `"business"`).
  - `ThemeContext` for light/dark/other themes shared across the app.
- **Reusable Components**
  - Event cards, community post cards, modals (e.g. time picker, profile modal), buttons, and filters.
- **Styling**
  - React Native `StyleSheet` with a shared `colors` theme file to keep the visual design consistent.

### Backend (API Server)

- **Node.js** + **Express**
  - RESTful API under `/api`.
  - Route groups for `auth`, `events`, and `community`.
- **Authentication & Authorization**
  - **JSON Web Tokens (JWT)** for stateless authentication.
  - `authMiddleware` to protect routes and attach the authenticated user to `req.user`.
  - `isBusiness` middleware to restrict event creation/editing to business accounts only.
- **Security & Best Practices**
  - Passwords hashed with **bcrypt** before being stored.
  - Sensitive values (e.g., JWT secret, database URL) loaded from environment variables via `dotenv`.

### Database

- **MongoDB** (e.g., MongoDB Atlas)
  - Document database for events, users, and community posts.
- **Mongoose**
  - Schemas and models for:
    - `User` (name, email, password hash, role, town, etc.)
    - `Event` (title, category, date/time, town, description, createdBy)
    - `CommunityPost` (type, town, body, user, replies, likes, timestamps)
  - Uses `populate()` to attach user information to posts when needed.

## 🧪 Testing

The backend is tested using **Mocha**, **Chai**, and **Supertest**.

### What is covered

The test suite includes integration tests for the most important API features:

- **Authentication**
  - Registers a new user
  - Logs the user in and returns a JWT
- **Events**
  - Fetches all events (`GET /api/events`)
  - Ensures only business users can create events (authorization check)
- **Community**
  - Fetches community posts (`GET /api/community`)
  - Authenticated users can create a community post (or receive validation feedback)

### Why these tests matter

- Confirms JWT authentication and middleware function correctly
- Verifies route structure, error handling, and authorization logic
- Ensures consistent server responses for major user flows
- Demonstrates debugging and test-driven thinking

### Running the tests

In the `server` folder run:

`npm test`

### Deployment

- **Backend**: Deployed to **Render** (Node/Express service)
  - Environment variables configured in Render dashboard (no secrets committed to GitHub).
  - Exposes a public base URL used by the mobile client.
- **Mobile App**: Published via **Expo**
  - Expo project link is included in this README.
  - The app is configured to talk to the deployed Render API rather than a local IP.
- This setup allows the instructor to:
  - Install Expo Go, open the app link, and use SummitScene against the live backend.

### Development Tools & Workflow

- **Git & GitHub** for version control and collaboration.
- **Thunder Client** for manually testing and debugging API routes.
- **npm** scripts for running the backend server, tests, and development tools.
- A **devlog** (linked below) documents weekly progress, debugging steps, and key design decisions.

## 🚀 Deployment

SummitScene is fully deployed with a **live backend** on Render and a **mobile client** published with Expo. This allows the application to be tested on any device without requiring local server setup.

### 📡 Backend Deployment (Node.js + Express)

The backend API is deployed as a Render Web Service:

**Live API Base URL:**
`https://summit-scene-backend.onrender.com`

#### Configuration Details:

- **Hosting Provider:** Render (Node Web Service)
- **Root Directory:** `server/` (monorepo structure)
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variables:**
  - `MONGODB_URI` – MongoDB Atlas connection string
  - `JWT_SECRET` – Secret used to sign JWT authentication tokens
  - `NODE_ENV=production`
- **Automatic deployments** are triggered on every push to the GitHub `main` branch.

The backend connects directly to **MongoDB Atlas**, allowing real-time data storage across events, users, and community posts.

---

### 📱 Mobile App Deployment (Expo)

The mobile client is built with **React Native (Expo)** and communicates with the Render backend through an environment variable:

const API_BASE_URL =
process.env.EXPO_PUBLIC_API_BASE_URL ||
"https://summit-scene-backend.onrender.com";
