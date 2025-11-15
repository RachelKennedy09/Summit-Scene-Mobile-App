### 📅 Sprint #1 Foundations and Events

Date: October 24th - November 13th

#### 🎯 Sprint Goals

1. Set up Expo project + folder structure
2. Install React navigation/Bottom tabs
3. create bottom tabs with placeholders (Hub, Map, Community, Account)
4. Add town filters
5. Design basic event card
6. Create static hubscreen with mock events
7. add category filters

#### 🔥 Challenges + How I Solved Them

- Issue: File structure confusion when splitting app folder & server folder.
- Fix: Reorganized project using only /server for API. Confirmed both run separately (npx expo start + node server/index.js).

- Issue: started of with expo router and tsx files without having enough practice with them.
- Fix: Deleted them when I went back to my app 3 weeks later and kept with what i know (js)

#### 🌟 Wins + Breakthroughs

- Few errors, Completed sprint 1 in one day.

#### 📚 What I Learned This Week

- Keeping the UI simple but with mock placeholders and events, so I can have a visual of the app before having to get real data.
- Installing correct dependencies

#### Photos of Progress Sprint 1

##### Trello Sprint

![alt text](image.png)

##### Github commits

![alt text](image-1.png)

##### HubScreen.js

![alt text](image-2.png)

##### MapScreen.js

![alt text](image-3.png)

##### PostEventScreen.js

![alt text](image-4.png)

##### CommunityScreen.js

![alt text](image-5.png)

##### AccountScreen.js

![alt text](image-6.png)

---

### 📅 Sprint #2 Backend and Events api

Date: November 14th

#### 🎯 Sprint Goals

1. Set up Node + Express + Mongodb
2. Connect to MongoDB
3. Define event model (town, category, dates, title, description, location, lat/lng, imagEUrl)
4. seed example events for Banff/Canmore/Lake Louise
5. Add full CRUD for events
6. Connect HubScreen to API (fetch events from backend)hubscreen with mock events
7. Loading and error states for event feed
8. Show events by town
9. See event details
10. pull to refresh

#### 🔥 Challenges + How I Solved Them

- Issue: MongoDB authentication error: bad auth.
- Fix: Updated .env connection string, ensured app user had correct permissions, and enabled IP access from “0.0.0.0/0”.

- Issue: HubScreen.js was at 400 lines of code.
- Fix: Created components (EventCard.js, TownChips.js and CategoryChips.js) to condense

- Issue: I mistakingly did EventDetails as a screen/tab instead of a stack. I realized it would cause errors and I dont need it as a tab. Especially why would you click it what type of event would you even see?
- Fix: I quickly fixed that and made it a stack instead of being in my tab navigator.
- Issue: I was struggling with why my refresher loading spinner was black and I couldnt change the color to white.
- Fix: Had to show my own white spinner over the expo go native spinner because it wouldnt go away.

### 🌟 Wins + Breakthroughs

- First successful API call from mobile app to my Express server
- Successfully displayed real event data using Axios
- Learned how to fix Expo Safe Area View installation
- Navigation works smoothly between Home -> Event Details
- App loads correctly on my phone using Expo Go + LAN
- API documentation started

### 📚 What I Learned This Week

- How to connect to MongoDB Atlas from a mobile app backend
- Gained experience with backend (MongoDB, Thunderclient) and successfully routed and did CRUD operations.
- Better at error handling and ensuring mock vs real data helped me visual the app.
- I struggled with understanding how to organize my App.js vs TabNavigator vs Rootnavigator when making eventdetaiscreen stack. This was a big learning curve for me.

#### Photos of Progress Sprint 2

##### Trello Sprint
![alt text](image-8.png)

##### MongoDB successfull conenction
"Connected to Mongo succesfully as of Nov 14th"
![alt text](image-7.png)
