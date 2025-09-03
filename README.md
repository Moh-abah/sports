# Live Sports Results Website

A Node.js web application that displays live sports results from TheSportsDB API.

## Features

- 🔄 Live match results
- 📅 Display of today's games
- 🏟️ Match details: teams, time, league
- ⚡ Fast and responsive UI
- 🌍 Real API integration (not mock data)
- 📦 Simple and lightweight codebase

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: HTML + EJS (Templating) + CSS
- **External API**: TheSportsDB – provides real-time sports data
- **Hosting**: Ready for Vercel / Render / Heroku

## Project Structure

\`\`\`
.
├── public/               → CSS styles
│   └── styles.css
├── views/                → Frontend templates
│   └── index.ejs
├── utils/                → Helper functions
│   └── fetchScores.js
├── .env.example          → Example for API key
├── server.js             → Main server file
├── package.json
└── README.md
\`\`\`

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd live-sports-results
