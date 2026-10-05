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

[Login Page] [https://github.com/HAU-6APSI/student-6apsi-2215-cyy-ril/blob/main/project/website-screenshots/Login-page.png]

[Signup Page] [https://github.com/HAU-6APSI/student-6apsi-2215-cyy-ril/blob/main/project/website-screenshots/Signup-page.png]

[Home Page] [https://github.com/HAU-6APSI/student-6apsi-2215-cyy-ril/blob/main/project/website-screenshots/Home-page.png]

[Bean Library Page] [https://github.com/HAU-6APSI/student-6apsi-2215-cyy-ril/blob/main/project/website-screenshots/Beanlibrary-page.png]
                    [https://github.com/HAU-6APSI/student-6apsi-2215-cyy-ril/blob/main/project/website-screenshots/Beanlibrary-page-withupdate.png]

[Log A Brew Page] [https://github.com/HAU-6APSI/student-6apsi-2215-cyy-ril/blob/main/project/website-screenshots/LogABrew-page.png]
                  [https://github.com/HAU-6APSI/student-6apsi-2215-cyy-ril/blob/main/project/website-screenshots/LogABrew-page-withupdate1.png]
                  [https://github.com/HAU-6APSI/student-6apsi-2215-cyy-ril/blob/main/project/website-screenshots/LogABrew-page-withupdate2.png]

[Journal Page]  [https://github.com/HAU-6APSI/student-6apsi-2215-cyy-ril/blob/main/project/website-screenshots/Journal-page.png]
                [https://github.com/HAU-6APSI/student-6apsi-2215-cyy-ril/blob/main/project/website-screenshots/Journal-page-withupdate1.png]
                [https://github.com/HAU-6APSI/student-6apsi-2215-cyy-ril/blob/main/project/website-screenshots/Journal-page-withupdate2.png]

## What it does

- Sign up, log in, or continue as a guest (guest brews stay on that device only)
- Add beans with a name, roaster, origin, and roast date
- Log a brew: dose, yield, grind, temperature, and time
- Rate each brew with a stars, and sliders for rate acidity, sweetness, body, and balance
- Pick a flavor tags from a flavor list, with search and categories
- Browse the Journal: search, filter by roast, sort by Newest first, Oldest first, Highest rated, Lowest rated, edit, and delete

## Built with

React and Vite on the front end, Express and PostgreSQL on the back end. The
client is on GitHub Pages, the API on (host), the database on (host).

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
  ## Set up the database
    Open your Supabase project, then the SQL editor.
    Run [PATH TO TABLES AND MIGRATION SQL] first.
    Then run [PATH TO ROW LEVEL SECURITY SQL].
    Policies need SELECT, INSERT, UPDATE, and DELETE, or edits fail.

**The whole stack.** Needs a PostgreSQL, either local or hosted.

    # 1. the database
    docker run --name my-pg -e POSTGRES_PASSWORD=devpassword \
      -e POSTGRES_DB=haunted -p 5432:5432 -d postgres:17

    # 2. the API
    cd server
    npm install
    cp .env.example .env        # check DATABASE_URL
    npm run db:reset            # creates the tables and adds sample rows
    npm run dev                 # http://localhost:3000

    # 3. the client, in another terminal
    cd client
    npm install
    cp .env.example .env     # then fill in the two values
    npm run dev              # http://localhost:5173


Check the API on its own before you blame the client:

    curl http://localhost:3000/healthz     # is the process alive
    curl http://localhost:3000/readyz      # is the database reachable
    curl http://localhost:3000/api/sightings

## Environment variables

None of these are committed. `.env.example` in each folder lists them with
placeholder values.

| Name | Where | What it is |
| --- | --- | --- |
| `DATABASE_URL` | server | PostgreSQL connection string. Contains a password |
| `CORS_ORIGINS` | server | comma-separated origins allowed to call the API |
| `NODE_ENV` | server | `production` on your host |
| `PORT` | server | **set by the host**, do not set it yourself |
| `VITE_USE_MOCK_API` | client, at build time | only `false` turns demo mode off; unset means on |
| `VITE_API_BASE_URL` | client, at build time | your API's public URL, no trailing slash |

Every `VITE_` value is compiled into the built JavaScript and is **public**.
Never put a key, a password or a connection string in one.

## Deploying

**Client, to GitHub Pages.** Already wired up in
`.github/workflows/deploy-pages.yml`. Two one-time steps:

1. **Settings > Pages > Build and deployment > Source: GitHub Actions.** Without
   this the workflow goes green and publishes nothing.
2. Nothing else, until your API is live. Demo mode is the default, so the first
   deploy works on its own. When the API is up, add `VITE_USE_MOCK_API` = `false`
   and `VITE_API_BASE_URL` under **Settings > Secrets and variables > Actions >
   Variables**, then re-run the workflow.

The repository must be **public** for Pages to serve it on a free account.

**API and database.** Not automated here, because most hosts deploy straight from
your repository with no workflow at all. Point your host at the `server/` folder,
set the environment variables in its dashboard, and run `server/db/schema.sql`
once against the hosted database.

## Project structure

    client/          React front end, built by Vite
      src/api/       ONE interface, two implementations, chosen by a variable
      src/components/
    server/          Express API
      db/            pool, schema.sql, seed.sql, and a runner for them
    compose.yml      only if you self-host
    docs/            your planning documents and weekly reports

## Architecture

Three or four sentences, or a small diagram. Which piece talks to which, and
where each one is hosted.

## What I would do next

Three honest bullets. This paragraph is worth more than it looks.

## Author

Your name, and a link. Course and section.

## AI use

If you used AI while building this, say so here. Honest disclosure is the
standard in this course and increasingly outside it, and reporting heavy use
accurately costs you nothing.

This section is the last 10 points of the finals badge, and it wants three
things:

![Built with AI assistance](https://img.shields.io/badge/built%20with-AI%20assistance-0b5fff)

- the badge above, or one you like better
- a line naming which assistant you used and how much of the work it touched
- a link to [AI-USAGE.md](AI-USAGE.md), where the full account lives

Keep the detail in `AI-USAGE.md` rather than here. This section is the summary a
visitor reads; that file is the record the badge is graded from.

## Licence

MIT, see [LICENSE](LICENSE). Put your own name in it.
