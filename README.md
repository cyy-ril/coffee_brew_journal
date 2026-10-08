# Coffee Brew Journal

> **Replace this whole file.** It is a worked example of the README your project
> will be graded from, not a file to leave as it is. Start with
> [START-HERE.md](START-HERE.md).

## 1. Overview

My project Coffee Brew Journal is a web app for home baristas to keep track of their pour-over and espresso brews, this lets you keep a library of beans, log the recipe and result of each brew (dose, yield, grind, water temp, time, ratio, rating, tasting notes) a user made, and there is also a search or filter for the past brews to find what worked. It's built for anyone who wants to repeat their coffee instead of guessing what to make every time a user makes coffee.

**Live site:** https://coffee-brew-journal.onrender.com
**Demo video:** (link)

## 2. Setup and installation

**What to install first (runtime, database, tools):**
Get the latest version of Node.js. This also need a code editor (VS Code recommended) with a git for cloning. You'll also need a free Supabase account, this is where your data and user accounts live.

**How to get the code (clone)**
```bash
git clone <your-repo-url>
cd <your-repo-folder>
```
**How to install dependencies**
```bash
cd client
npm install
```
**Environment and configuration** 

Create a file called .env in your project main folder. This is where you put your Supabase keys so the app can use them, without putting them directly in the code.
```
VITE_SUPABASE_URL = your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-public-key
```
**How to set up and seed the database**

Create your free Supabase project this web app will depends on Supabase's built-in authentication. In your projects in the SQL editor, run the schema file to create the beans and logs tables. Then go to the Authentication settings and turn on the email/password sign-in. 


![A screenshot of the main screen]

[Login Page]
<img width="1919" height="1061" alt="Login-page" src="https://github.com/user-attachments/assets/8af2add3-74ab-4b3b-8a7f-6c5e96dce5dc" />

[Signup Page] 
<img width="1919" height="1061" alt="Signup-page" src="https://github.com/user-attachments/assets/17b41ab1-d816-4da4-a842-57971484eccc" />

[Home Page] 
<img width="1919" height="1057" alt="Home-page" src="https://github.com/user-attachments/assets/281353b1-599d-461d-9153-965b5b33aa2f" />

[Bean Library Page]
<img width="1900" height="1057" alt="Beanlibrary-page-withupdate" src="https://github.com/user-attachments/assets/9ba09510-7832-494b-92ca-ac5ca19d9b1d" />
        
[Log A Brew Page]
<img width="1895" height="1051" alt="LogABrew-page-withupdate1" src="https://github.com/user-attachments/assets/12e39d97-98e8-42d0-b59b-34d9eecc35aa" />
<img width="1905" height="1046" alt="LogABrew-page-withupdate2" src="https://github.com/user-attachments/assets/6bf1991a-1a6d-4bcb-a890-cb4cbba74da5" />

[Journal Page]
<img width="1919" height="1065" alt="Journal-page-withupdate1" src="https://github.com/user-attachments/assets/87fc44e3-6eca-416d-bd3e-94b5c7272e22" />
<img width="1912" height="1053" alt="Journal-page-withupdate2" src="https://github.com/user-attachments/assets/3c19d454-3923-4e41-a607-052b9f421d3b" />

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

## Demo mode

This repository can run two ways, chosen by one environment variable at **build**
time.

**Demo mode is the default.** Only the exact string `false` turns it off, so a
forgotten or mistyped variable leaves you on the simulated backend with a visible
notice rather than on a silently broken build.

| `VITE_USE_MOCK_API` | What happens |
| --- | --- |
| unset, or `true` | The client answers its own requests from `localStorage`. No server, no database, nothing shared between visitors. This is what the template ships with, so the GitHub Pages link works on day one. |
| `false` | The client calls the Express API at `VITE_API_BASE_URL`, which reads and writes real PostgreSQL. |

**Demo mode is a starting point and a fallback, not a finished project.** Your
finals submission is all three pieces deployed and talking to each other. Demo
mode is there so you can build the interface in week one before the API exists,
and so you have something to show if a free tier is asleep during your demo.

GitHub Pages serves files and cannot run Node, so the API and the database can
never live there. They go somewhere else:

| Piece | Options |
| --- | --- |
| **API** | Render, Railway, Fly.io, Koyeb, a VPS, or [self-hosted behind a tunnel](../content/extending-your-app/11-self-hosting.md) |
| **Database** | Neon, Supabase, Railway, Aiven, or your own PostgreSQL |

`content/extending-your-app/` in your course workspace walks through all of it.
Page 10 is the decision page if you do not know which to pick.

## Running it yourself
  **Set up the database**
  
  - Open your Supabase project, then the SQL editor.
  - Run the `supabase/schema.sql`. this creates the tables (with all the columns) and the Row Level Security policies.
  - This project will need four policies: SELECT, INSERT, UPDATE, and DELETE. Without UPDATE, the editing fails.

**Set up the client.**

    cd client
    npm install
    cp .env.example .env     # then fill in the two values
    npm run dev              # http://localhost:5173

  **Start**
  
    Open http://localhost:5173 in your browser or in the VS Code. You should be able to see a login/sign-up page with a "Continue as guest" option. 
    After signing up (or choosing guest mode), you will land on the Home screen with a brew stats and a button to add your first brew.

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

Your name, and a link. Course and section.

## AI use

![Built with AI assistance](https://img.shields.io/badge/built%20with-AI%20assistance-0b5fff)

- the badge above, or one you like better
- a line naming which assistant you used and how much of the work it touched
- a link to [AI-USAGE.md](AI-USAGE.md), where the full account lives

Keep the detail in `AI-USAGE.md` rather than here. This section is the summary a
visitor reads; that file is the record the badge is graded from.

## Licence

MIT, see [LICENSE](LICENSE). Put your own name in it.
