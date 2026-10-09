# Coffee Brew Journal

## 1. Overview

My project Coffee Brew Journal is a web app for home baristas to keep track of their pour-over and espresso brews, this lets you keep a library of beans, log the recipe and result of each brew (dose, yield, grind, water temp, time, ratio, rating, tasting notes) a user made, and there is also a search or filter for the past brews to find what worked. It's built for anyone who wants to repeat their coffee instead of guessing what to make every time a user makes coffee.

**Live site:** https://coffee-brew-journal.onrender.com

**Demo video:** [Coffee Brew Journal Video Presentation](https://drive.google.com/file/d/1RixcobPKDrEy4odNF5D05tGHu0n2P8v3/view?usp=drive_link)

**Screenshots of the main screen**

<img width="1919" height="1057" alt="Home-page" src="https://github.com/user-attachments/assets/281353b1-599d-461d-9153-965b5b33aa2f" />

## 2. Setup and installation

**What to install first (runtime, database, tools):**
- Get the latest version of Node.js.
- This also need a code editor (VS Code recommended) with a git for cloning.
- You'll also need a free Supabase account, this is where your data and user accounts live.

**How to get the code (clone)**
```bash
git clone https://github.com/cyy-ril/coffee_brew_journal.git
cd coffee_brew_journal
```
**How to install dependencies**
```bash
cd client
npm install
```
**Environment and configuration** 

- Create a file called .env in your project main folder.
- This is where you put your Supabase keys so the app can use them, without putting them directly in the code.
```
VITE_SUPABASE_URL = your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-public-key
```
**How to set up and seed the database**

- Create your free Supabase project this web app will depends on Supabase's built-in authentication.
- Run the `supabase/schema.sql`. this creates the tables (with all the columns) and the Row Level Security policies.
- This project will need four policies: SELECT, INSERT, UPDATE, and DELETE. Without UPDATE, the editing fails.
- Then go to the Authentication settings and turn on the email/password sign-in.

**Set up the client.**

    cd client
    npm install
    cp .env.example .env     # then fill in the two values
    npm run dev              # http://localhost:5173

  **Start**
  
  - Open http://localhost:5173 in your browser or in the VS Code. You should be able to see a login/sign-up page with a "Continue as guest" option.
  - After signing up (or choosing guest mode), you will land on the Home screen with a brew stats and a button to add your first brew.

## What it does

- Sign up, log in, or continue as a guest (guest brews stay on that device only)
- Add beans with a name, roaster, origin, and roast date
- Log a brew: dose, yield, grind, temperature, and time
- Rate each brew with a stars, and sliders for rate acidity, sweetness, body, and balance
- Pick a flavor tags from a flavor list, with search and categories
- Browse the Journal: search, filter by roast, sort by Newest first, Oldest first, Highest rated, Lowest rated, edit, and delete

## Built with

React and Vite on the front end. Used Supabase for the login and the Postgres database. The app talks to the Supabase straight from the browser, 
so I do not have a server of my own. The site is hosted on Render as a static site.

## Environment variables

None of these are committed. `.env.example` in each folder lists them with
placeholder values.

| Name | Where | What it is |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | client, at build time | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | client, at build time | Supabase public (anon) key |

The VITE_ value is compiled into the built JavaScript, so it is public. The anon key is meant to be public.
What protects the data is the Row Level Security in the database (Supabase). Never put a service_role key in the client.

## Deploying

| Setting | Value |  
| --- | --- |
| Branch | main |
| Root Directory | client |
| Build Command	| npm install && npm run build |
| Publish | Directory	dist |
| Environment variables |	VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY |

## Project structure

    coffee_brew_journal/
    ├── client/                    
    │   ├── src/
    │   │   ├── assets/		            # images used in the UI
    │   │   ├── App.jsx		            # routing, auth/guest state, all screens
    │   │   ├── App.css		            # styling
    │   │   ├── Auth.jsx		          # login / sign-up / guest-mode screen
    │   │   ├── main.jsx		          # React entry point
    │   │   ├── supabaseClient.js  	  # Supabase client setup (this reads env vars)
    │   │   └── flavorWheel.js	      # tasting-note categories for the flavor picker
    │   ├── .env			                # local environment variables (not committed)
    │   ├── .env.example
    │   ├── index.html
    │   ├── package.json
    │   ├── package-lock.json
    │   └── vite.config.js
    ├── supabase/
    │   └── schema.sql                # full database setup (tables, columns, RLS policies); this is run in the Supabase SQL Editor
    │   └── alter-tables.sql		      # only for the older version of my database; this is already included in schema.sql	
    ├── server/			                  # not used
    ├── README.md		                  # project overview and setup instructions
    ├── AI-USAGE.md		                # documentation of AI usage
    └── LICENSE			                  # MIT License


## Architecture

The browser runs the React app, which is being hosted as a static site on Render. The app calls Supabase directly for the login (in the Supabase Auth) and for the data. 
The Row Level Security rules in the database make sure that a signed-in user can only read and change their own beans and brews. 
While the Guests have no account, so their beans and brews are saved in the browser's localStorage and it does not reach the database.

## What I would do next

- A chart of my best brews
- Let the guests move their brews into an account
- Add a photo of the bean bag to each bean.
- A forget password feature

## Author
Cyril Cris Bacani

[Github Profile Link](https://github.com/cyy-ril)

CS - 403

## AI use

![Built with Claude](https://img.shields.io/badge/Made_with-Claude-D97757?logo=anthropic&logoColor=white)

- See how I used AI [AI-USAGE.md](https://github.com/cyy-ril/coffee_brew_journal/blob/main/AI-USAGE.md)

## Licence

MIT, see [LICENSE](https://github.com/cyy-ril/coffee_brew_journal/blob/main/LICENSE).
