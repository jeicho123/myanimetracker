# MyAnimeTracker

A web app where users can browse a fresh and wide selection of anime to track the animes they have watched, are currently watching, and plan to watch.

## Demo
https://github.com/user-attachments/assets/2e4d66df-5e98-4bcf-8df5-c6a39799fa81

https://myanimetracker-d961f.web.app/

## Features

- Extensive Browsing Options - Locate anime efficiently with:
  - Search bar for quick lookups
  - Dedicated tabs for popular, currently airing, and all anime
- Flexible Anime Tracking - Add, update, or remove anime from your lists
  - Organize into *Watched*, *Currently Watching*, *Plan to Watch*
  - Switch between lists or remove as needed
- Redux State Management - Manage anime lists locally to minimize requests
- Google OAuth and Guest Mode - Easy access and stored anime tracking progress

## Tech Stack

- React.js
- Redux
- Firebase

## Getting Started

### Prerequisites

- Node.js
- Firebase account
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jeicho123/myanimetracker.git
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project and update the configuration in `src/config/firebase.js`

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and visit `http://localhost:5173`
