# Amanda — Party Game Web App

**Slogan:** _Light up the night_

---

## 🎉 Overview

Amanda is a mobile-first, real-time, multiplayer web app designed to supercharge parties with the classic “Who's Most Likely To..." game. Built for friend groups looking to break the ice, spark debates, and create unforgettable memories, Amanda turns any gathering into a night of laughter, playful tension, and friendly competition.

---

## 🧭 Design Principles

- **Mobile-First, Always:** Every interaction, animation, and layout is optimized for thumb-friendly, one-handed use on mobile devices. Desktop support is secondary.
- **Social & Playful:** The UI and UX encourage group engagement, lively debate, and a sense of togetherness—even when everyone's on their own phone.
- **Fast & Frictionless:** Joining a game, voting, and moving between rounds is quick and intuitive, minimizing downtime and maximizing fun.
- **Inclusive & Accessible:** Semantic HTML, keyboard navigation, and high-contrast visuals ensure everyone can play, regardless of ability.
- **Translatable & Localized:** All text is managed via locale files, making Amanda ready for any language or party culture.

---

## 🕹️ Game Flow & Screens

### 1. **Welcome / Join Game**

- **Inputs:**
  - **Room Code:** Enter a code to join a specific game session.
  - **Nickname:** Your party persona for the night.
  - **Color Picker:** Choose a unique color for easy identification in votes and results.
- **Validation:**
  - Nickname and color must be unique within the room.
  - Room code must be valid.
- **Actions:**
  - **Join Game:** Connects to the session via real-time sockets.

---

### 2. **Waiting Room / Lobby**

- **Category Carousel:** Swipe through game categories (e.g., "Wild Nights", "Embarrassing Moments", "Friendship Testers"), each with a mysterious image, catchy title, and a playful description.
- **Player List:** See who's joined, their nicknames, and their chosen colors (no avatars, just vibrant color swatches).
- **Participant Count:** Always visible, with a fun animation as new players join.
- **Host Controls:**
  - Select category.
  - Start game when ready.
- **Mobile Tab:** Expandable bottom sheet to view all players and their colors.

---

### 3. **Game In Session**

#### a. **Question Display**

- **Animated Question:** "Who's most likely to..." with lively transitions.
- **Player Carousel:** Scrollable nicknames and color swatches for voting.
- **Voting:**
  - Tap a player to cast your vote.
  - Visual feedback on selection.
  - Can change vote until everyone's locked in.

#### b. **Voting State**

- **Progress Indicator:** See who's voted and who's still deciding (e.g., nicknames with checkmarks or pulsing color swatches).
- **Host Option:** Skip to results if everyone's done or to keep the game moving.

#### c. **Results Reveal**

- **Vote Summary:** Animated reveal of who got the most votes, with confetti or spotlight effects.
- **Breakdown:** Show how each player voted (optionally, for more drama).
- **Fun Stats:** "X people think Omer is most likely to..."
- **Host Actions:** Next question, skip, or end game.

---

### 4. **Game End / Leaderboard**

- **Leaderboard:** Players ranked by total votes received (who "won" the most rounds).
- **Drinking Stats:** (Optional/fun) "Who drank the most?" or "Who dodged the most votes?"
- **Actions:**
  - Play another round (same category).
  - Pick a new category.
  - Quit to main screen.

---

### 5. **Other UX States**

- **Loading/Connecting:** Fun, animated transitions for joining rooms, waiting for players, or syncing game state.
- **Error States:** Friendly, clear messages for invalid codes, duplicate nicknames, or connection issues.
- **Localization:** All text, labels, and messages are translatable via locale files.

---

## 🌍 Localization & Accessibility

- **i18n Support:** All UI text is managed via locale files for easy translation.
- **Semantic HTML:** Proper use of headings, buttons, and ARIA roles.
- **Color Contrast:** All color choices meet accessibility standards.
- **Keyboard Navigation:** All interactive elements are reachable and usable via keyboard.

---

## 🛠️ Tech Stack

- **React** (UI)
- **React Router DOM** (Navigation)
- **React Query** (Server state)
- **Tailwind CSS** (Styling)
- **shadcn/ui** (Headless components)
- **Framer Motion** (Animations)
- **socket.io-client** (Real-time multiplayer)
- **i18next** (Localization)

---

## 📝 Future Ideas

- **Photo Avatars:** Upload or snap a selfie for your player icon.
- **Mini-Games:** Quick challenges between rounds.
- **Themed Nights:** Special categories for holidays, birthdays, etc.

---

## 🚀 Summary

Amanda is more than just a game—it's a catalyst for laughter, connection, and unforgettable party moments. Every design and logic choice is made to keep the energy high, the experience seamless, and the fun flowing all night long.
