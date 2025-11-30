## 📅 Sprint #9 Polishing (November 27)

### HubScreen.js Polish

#### Sprint Goals

1. Add Hero Section
2. Create Pill Buttons component
3. Create town modal selecter
4. Create category modal selecter
5. hook pills to existing filters
6. add date pill and logic

### Event Polish

1. Add event end time to event model
2. add fresh styling to event cards
3. Business users = "My Past Events" \*\*\*PLEASE NOTE: for development and grading purposes, I left the date handling to be able to choose a PAST date, so you can see the "My past events" feature. Otherwise I would add error handling so people couldnt post an event on a already past date.
4. Local users = Past events completely removed from Event Hub
5. Better handling on the "Date Picker" on PostEventScreen so people can choose todays date easier, and click confirm/cancel for easier handling
6. Better handling on the "Time Picker" on PostEventScreen so people can choose start and end times easier, and click confirm/cancel for easier handling
7. Edit "EditEventScreen" after making changes to PostEventScreen

### Account Polish

1. Add token key so user doesnt get logged out/memory loss when rloading the application
2. Add " Youre logged in as a business/local user"
3. Add "Hello, ${NAME}, Welcome to your summit scene hub

### Map Polish

1. Add Town, Category, Date pills like HubScreen
2. Zoom effect when choosing a town on map

### Community Polish

1. Town filter pills with a modal
2. Summary line after choosing town
3. Show an identity to the posts (Who posted)
4. Reply options

#### Photos of Progress - Sprint 9

Trello Cards for Hubscreen and Event Polish

![alt text](devlogimages/TrelloCardEventAndHubPolish.png)

Git commit for HubScreen and Event Polish

![alt text](devlogimages/GitCommitNov27PolishHubEvent.png)

App ScreenShot For Town Category Date pills

![alt text](devlogimages/APPTown,Cat,DatePicker.png)

App Screenshot for "Date Picker" user friendly

![alt text](devlogimages/APPDatePicker.png)

App Screenshot for "time picker' user friendly

![alt text](devlogimages/APPTimePicker.png)

MongoDB Reply array

![alt text](devlogimages/MONGODBReply.png)

GitCommit Nov 27th

![alt text](devlogimages/GitcommitNov27.png)

## Sprint 10: Local Profiles + Community Access

### 🎯 Sprint Goals

1. Add rich user profiles (avatar, town, bio, lookingFor, Instagram, website).

2. Integrate profiles into Community posts with a “View Profile” modal.
3. Allow locals and businesses to edit their profile details (new EditProfileScreen).
4. Differentiate Local vs Business profile wording (“Community Profile” vs “Event Posting Profile”).
5. Add role-based profile preview in Account screen.
6. Set up user profile update route on backend (PATCH /api/users/update-profile).

---

### 🔥 Challenges + How I Solved Them

<b>Issue: Enum validation blocked real towns (e.g. "lake louise").</b> When registering, the backend refused certain valid towns because the town enum was too strict.

## <b>Fix:</b>

Relaxed validation -> changed enum to lowercase: true or broader allowed values. Registration now accepts real places like Lake Louise.

<b>Issue: : Profile information cluttered the Community cards and became overwhelming. </b> Showing town, email, lookingFor, Instagram, and business website inside each post made the cards feel busy and messy.

<b>Fix:</b> Created a clean “View Profile” modal → displays a user’s full profile in a separate focused view.
Community cards now stay clean and readable.

---

<b>Issue: Business and Local users needed different profile contexts.</b> Locals use profiles for Community, while businesses use profiles for Event Hosting — but wording was identical, causing confusion.

<b>Fix:</b> Added role-based UI copy:

Local: “Community profile — This is how your profile appears on Community posts and replies.”

Business: “Event posting profile — This is how your profile appears when you host events.”

This makes the experience personalized and professional.

---

<b>SIDE Issue: Deleted user on MongoDB and user was still able to make an event post(business)</b>

<b>Fix:</b> Added user auth and made sure the db ran before the vent posting to make sure user still exists.

### 🌟 Wins + Breakthroughs

- Added full role-based profiles with clean editing UX.

- Community posts now show a profile modal, not cluttered cards.

- Introduced a dedicated AccountStack for cleaner navigation architecture.

- Profile section on AccountScreen now adapts to Local vs Business.

- Registration fully supports richer fields without crashing.

- Laid foundation for changing email/password in a future sprint.

### 📚 What I Learned

- How to create role-specific UI experiences using conditional rendering.

- How to extend auth models and pass additional profile fields.

- How UX clarity significantly improves when data is separated from UI (modal vs card clutter).

---

### photos of progress Sprint 10

Issue Photo With lake louise enum: too strict when registering

![alt text](devlogimages/TERMINALerrorenum.png)

Profile building for Locals

![alt text](devlogimages/APPprofilelocal.png)

Profile buildling for Business

![alt text](devlogimages/APPProfilebusiness.png)Tre

Trello Card done for Sprint 10

![alt text](devlogimages/TRELLOsprint10done.png)

Git commit

![alt text](devlogimages/GitCommitSprint11.png)

## Sprint 11: Community Reply Upgrade, Show profile info on replies. Add Likes.

### Sprint Goals

1. Add the ability for users to like community posts

2. Improve identity on replies by showing each replier’s full profile info

3. Populate author details correctly for all replies (name, avatar, role, town, etc.)

4. Improve UI for replies (timestamp styling, avatars, and profile modal integration)

5. Add frontend logic to detect if the logged-in user already liked a post

### Challenges + How I Solved Them

<b>Issue: Replies were showing “SummitScene member” instead of the user’s real profile</b>
Backend reply schema wasn’t fully populated, and the frontend wasn’t pulling full user details.

<b>Fix:</b> - Added backend .populate("replies.user", "name role avatarUrl town lookingFor instagram bio website")

    - Updated frontend reply rendering to read from reply.user when populated

    - Replies can now show proper avatars, names, towns, roles, bios, and social links

<b>Issue: Likes were not implemented for Community posts </b> The model had no like logic, and no controller existed to toggle likes.

<b>Fix:
</b> - Added a dedicated like array in the CommunityPost model

    - Added backend /api/community/:id/likes route + controller

    - Implemented toggle logic (add/remove)

    - Added frontend UI with active highlight, like count, and heart toggle

    - Reloads posts after liking to keep state in sync

<b>Issue: Reply timestamps were hard to read (text showing in black) </b> No color styling existed for the reply meta text.

<b>Fix:</b> Added a new replyMeta style with color: colors.textMuted
Ensures timestamps are readable and consistent with UI palette

### Wins + Breakthroughs

- Replies now fully show the correct user profile data (avatar, name, town, role)

- Added View Profile modal support for replied users

- Community posts now support likes, with accurate highlight state

- Reply UI feels polished — timestamps styled, avatars aligned, and better readability

- Backend + frontend now fully in sync for community interactions

- Community board feels far more social and interactive — massive UX upgrade

### What I Learned

- How to populate nested fields inside array subdocuments

- How to structure a “toggle” route (idempotent like/unlike flow)

- How to sync UI state with the backend using fetchPosts() after update

- Importance of designing models to support future features (likes, replies, etc.)

### photos of progress Sprint 11

APP photo showing replies with name, and likes

![alt text](devlogimages/APPreplyandlikeupgrade.png)

Trello Sprint done

![alt text](devlogimages/TRELLOsprint11done.png)

---

## Sprint 12: Light and Dark Theme

### Sprint Goals

1. Add full multi-theme support across the entire mobile app

2. Create a ThemeContext capable of loading + saving themes

3. Support Light, Dark, Feminine, Masculine, and Rainbow themes
4. Add theme selection UI to the Account screen
5. Ensure all existing screens refresh correctly when the theme changes
6. Fix calendar visibility issues on dark themes
7. Maintain compatibility with all existing UI components

### Challenges + How I Solved Them

<b>Issue: Date picker numbers invisible on dark mode </b> On Android, the calendar day numbers stayed black even when switching into dark theme, making them unreadable.

<b>Fix:</b>

- Wrapped the DateTimePicker inside a themed white card background

- Applied themeVariant={theme.isDark ? "dark" : "light"} as a fallback for iOS

- Ensured backgroundColor: theme.card is forced behind all pickers

<b>Issue: </b>

<b>Fix:
</b>
<b>Issue: </b>

<b>Fix:</b>

### Wins + Breakthroughs

- Added 5 complete global themes

- Fully upgraded the ThemeContext system:

- Added a theme selector UI to AccountScreen with beautiful pill buttons

- Theme architecture now supports unlimited future themes

- Strengthened entire UI foundation for future Sprint 10 UI polish

-

### What I Learned

- How to build a reusable global theme system in React Native

- How to design themes using tokens (background, card, text, accent, etc.)
- How to theme native components like DateTimePicker that resist color change

-

### photos of progress Sprint 12

App Photo of Theme pills

![alt text](devlogimages/APPthemepillsaccountscreen.png)

Trello sprint 12 - themes done

![alt text](devlogimages/TrelloSprint12themes.png)

Git Commit Sprint 12

![alt text](devlogimages/GitCommitSprint12.png)

---

## Sprint 13: File Cleanup before more features

### Sprint Goals

1. Community Screen
2. Hub Screen
3. Account Tab
4. Map
5. Event Screens (Detail, Edit, Post)

---

### Challenges + How I Solved Them

<b>Issue: Community screen was ~1500 lines of code and becoming a bit messy.</b>

<b>Fix:</b> I moved my backend requests into a dedicated `communityApi.js` helper and moved UI for member profiles into `MemberProfileModal.js`. This keeps my Community screen much smaller and easier to read. It now follows separation of concerns: **data logic in services, presentational UI in components**, and the screen file mostly just wires everything together.

---

<b>Issue: Hub screen was nearly 1000 lines and mixing filters, layout, and list rendering in one file.</b>

<b>Fix:</b> I extracted the entire filter/header area into a reusable `HubFilters` component. I also centralized `TOWNS`, `CATEGORIES`, and `DATE_FILTERS` constants, and kept the Hub screen focused on:

- loading + filtering events
- building the `resultSummary` string
- rendering each event (with a small, focused `renderEvent` function)

This made the Hub screen shorter, more readable, and easier to extend later (for example, if I want to add more filters).

---

<b>Issue: Account Screen was tightly coupled to hard-coded colors and had a bug using <code>styles.something</code> instead of <code>theme.something</code>.</b>

<b>Fix:</b> I cleaned up the Account screen to use the `useTheme()` hook everywhere instead of raw `colors.*`. I also wired it into my theme picker (Light / Dark / Feminine / Masculine / Rainbow) so the account UI actually reflects the active theme. While doing this I fixed the `styles` reference bug by correctly switching to theme-based values (for example `theme.text`, `theme.textMuted`, etc.).

---

<b>Issue: Map Screen was large and duplicated a lot of Hub logic for filters and layout.</b>

<b>Fix:</b> I extracted a `MapFilters` component that mirrors the Hub filter UX (town, category, date range) but is focused on map-specific copy and layout. The Map screen now:

- uses the same town/category/date filters as the Hub
- keeps map logic (markers, region, camera animation) in one place
- delegates the pill UI + error/summary line to `MapFilters`

I also made sure the map container uses theme-based colors instead of raw `colors.*`, which keeps things consistent across themes.

---

<b>Issue: Event screens (Detail, Edit, Post) were each implementing their own modals and pickers, which created a lot of duplicated code.</b>

<b>Fix:</b> I did a shared “Event UI cleanup” pass:

- **EventDetailScreen**

  - Kept all the business logic (delete, navigate to Edit, host detection), but cleaned up how the UI uses `theme` for colors.
  - Confirmed the “Hosted by” section uses a helper (`getEventHost`) so it only shows for business users.
  - Made the owner-only area (“This is your event”, Edit / Delete buttons) clean and theme-aware.

- **EditEventScreen**

  - Swapped inline date/time pickers over to shared components:
    - `DatePickerModal` for dates
    - `TimePickerModal` for start and end times
    - `SelectModal` for Town and Category
  - Reused the same date formatting and time handling pattern as Post Event.
  - This removed a lot of inline `<Modal>` markup and duplicate button layouts.

- **PostEventScreen**
  - Removed the inline `TimePickerModal` definition from this file and replaced it with the shared `TimePickerModal` component.
  - Replaced town/category modals with reusable `SelectModal`.
  - Hooked up `DatePickerModal` to use the same `dateObj → "YYYY-MM-DD"` helper.
  - Kept all of the existing business logic (401 session expired → logout, 403 not a business, success → reset form + navigate to MyEvents).

Overall, the Event tab is now more consistent and far less repetitive. Any future updates to date/time UX or select modals can be done in one place.

---

### Wins + Breakthroughs

- Shortened code and made the Community tab more organized by moving API logic into `communityApi.js` and profile UI into `MemberProfileModal.js`.
- Extracted a `HubFilters` component so the Hub screen is focused on data + list rendering, not giant chunks of UI markup.
- Cleaned up the Account tab to use `useTheme()` properly and fixed the `styles` vs `theme` bug, while also wiring in theme selection options.
- Extracted a `MapFilters` component and aligned the Map filters (town/category/date) with the Hub tab, making the experience consistent across screens.
- Reused shared UI pieces (`DatePickerModal`, `TimePickerModal`, `SelectModal`) between Post Event and Edit Event, removing a big chunk of duplicated `<Modal>` code.
- Made the Event Detail / owner tools more readable and theme-aware without changing the core logic.

---

### What I Learned

- How to **separate concerns** in a React Native app: screens should orchestrate data + navigation, while components handle UI and layout.
- That extracting **shared components** (filters, pickers, select modals) not only shortens files, but also makes future feature changes safer and faster.
- How to lean on a central **ThemeContext** instead of hard-coded colors so new themes (light, dark, feminine, masculine, rainbow) “just work” across screens.
- That cleanup sprints are just as important as feature sprints — once the screens are smaller and more modular, it’s mentally easier to add new features without fear of breaking everything.

### photos of progress Sprint 13

![alt text](devlogimages/Gitcommitsprint13.png)
