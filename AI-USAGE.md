# AI usage

This project was built with AI assistance. This file shows where I used it, where it got things wrong, and which parts I wrote myself.

## 1. How I used AI

I used AI for the parts that were hard for me or new to me. The easy parts, I did on my own.
 
Note: All the commits are 2026-09-30. I worked on the code in VS Code before that, I only committed it on 2026-09-30 because I did not read the instructions clearly.

### 2026-09-30 - Supabase log-in and sign-up
 
- **Tool:** Claude
- **What I asked for:** I had never built a log-in and sign-up before. So I asked how to add a sign-up and log-in to my React app using the Supabase. 
- **What it gave back:** The Supabase gave back the signInWithPassword and signUp, and a form that switches between the two.
- **What I kept, what I changed, and why:** I kept the Supabase calls in the Auth.jsx part because I did not know how to send the email and password safely. For what I changed, its the messages that user sees and I also added a "Continue as guest" button to make sure that users that just want to try can just look and use the web app without signing-up and logging-in. 
- **Commit:** [PASTE COMMIT LINK]
### 2026-09-30 - Row Level Security (users only see their own data)
 
- **Tool:** Claude
- **What I asked for:** How do I make sure that a user cannot see another user's beans and brews in the database? 
- **What it gave back:** It gave a SQL create policy rules which uses auth.uid() and the user_id column, so that a signed-in user can only view, add, and delete their own rows. 
- **What I kept, what I changed, and why:** I kept the policies because I had not written SQL like this before and I actually did not know how auth.uid() connects to user_id. For this I created a policy for the edit part because when I added a new feature to the web app the bean and log cannot be updated.
- **Commit:** [PASTE COMMIT LINK]
### 2026-09-30 - Guest mode with localStorage
 
- **Tool:** Claude
- **What I asked for:** How do I make a guests save a beans and brews without an account? 
- **What it gave back:** It gave me the useLocalStorage starting point, which allows to reads the saved data when the page loads and also saves it again when it changes.
- **What I kept, what I changed, and why:** I kept the starting point because I did not know how do I make the browser be saved and load by itself. I added the guest ids with a makeGuestId so that it does not clash with database ids. 
- **Commit:** [PASTE COMMIT LINK]
### 2026-09-30 - Matching database names to my app's names
 
- **Tool:** Claude
- **What I asked for:** My database columns look like a roaster_name, but in my React code it uses a roasterName. How do I switch between them?
- **What it gave back:** it gave me four functions which is beanFromDb, beanToDb, logFromDb, and logToDb. 
- **What I kept, what I changed, and why:** I kept it because the saving and loading kept breaking and I did not know do I actually fix it in one place. I made sure to add a default value like ?? 3 for the cupping sliders so that the older logs could still work. 
- **Commit:** [PASTE COMMIT LINK]
### 2026-09-30 - Adding new columns to a database that already has data
 
- **Tool:** Claude
- **What I asked for:** I wanted to add a cupping score, flavor tags, and bean details to my tables, but I already have a saved beans and logs. So I asked how do I add the columns without losing them. 
- **What it gave back:** It gave me a migration file in SQL for me to put in my Supabase. It also uses a add column if not exists, so it is safe to run twice.
- **What I kept, what I changed, and why:** I kept because I was scared of breaking the live database and I did not know how do I  change a table that already has data. Before I ran it in my Supabase SQL editor, I made sure to change the column names to make sure that it matched the names my app. 
- **Commit:** [PASTE COMMIT LINK]
### 2026-09-30 - Loading beans and logs at the same time
 
- **Tool:** Claude
- **What I asked for:** How do I load a beans and logs from the Supabase together and make sure that it show a loading state?
- **What it gave back:** It gave me a Promise.all that waits for both requests before showing to the page. 
- **What I kept, what I changed, and why:** I kept this because I did not know how do I wait for the two calls at once or handle this kind of errors. I added a loading skeletons component so that the user could see a grey placeholder boxes while the data loads, instead of an empty page. 
- **Commit:** [PASTE COMMIT LINK]
## 2. Where the AI got it wrong
 
### Case 1 – The code didn't match my database
 
- **What it gave me:** Updated code for saving beans and brew logs, with new fields like roaster_name, origin, acidity, sweetness, body, balance and flavor_tags, plus a migration.sql file to run in Supabase.
- **What was wrong with it:** My Supabase tables didn't have those columns yet, and the Claude didn't remind me to update. That is why every I try to save it failed with a 400 Bad Request in the console.
- **What I did instead:** After knowing that it gave me error I checked my table columns in the SQL editor, then I ran a migration.sql file to add the missing columns. After that I checked again to confirm if they were there, and the saving and update worked.
- **Commit:** [PASTE COMMIT LINK]
### Case 2 - Editing failed with a 406 (missing UPDATE policy)
 
- **What it gave me:** A feature for beans and brew logs that used to SELECT, INSERT and DELETE, but there is no UPDATE policy because I did not specifically said that I needed an UPDATE policy. When the editing failed, its first guess was that the problem was in how the app matched a brew to its bean by name.
- **What was wrong with it:** That guess that it gave me was wrong. The adding and deleting worked, but every edit gave me a 406 error. The real problem was actually in my database. My Row Level Security had policies for the SELECT, INSERT and DELETE, but there is no UPDATE policy, because of this Supabase silently blocked every edit.
- **What I did instead:** There was no Update policy so I added this to the file and run it, then the saving/editing worked for both log and beans.
- **Commit:** [PASTE COMMIT LINK]
### Case 3 – My imports broke after I moved my files into the repo
 
- **What it gave me:** after asking why my imports don’t work, it gave me a code that imported icons from the ./icons/add.svg and the logo from ./cup-of-coffee icon.svg, as well as a list of files to copy into client/src. The list didn't mention that @supabase/supabase-js was missing from the repo's package.json.
- **What was wrong with it:** In my repo the icons were in assets/, and the logo was named cup of coffee icon.svg, without the hyphens. Vite also couldn't find @supabase/supabase-js. So I just got a "Failed to resolve import" errors message one file at a time, then a blank page with "supabaseUrl is required" because I didn’t  made my .env yet.
- **What I did instead:** I changed the imports to ./assets/ and the exact filename. I  also ran again an npm install @supabase/supabase-js inside client. I copied the .env.example to .env and filled in my Supabase URL and its key, then restarted the Vite.
- **Commit:** [PASTE COMMIT LINK]
## 3. Who wrote what
 
### Written by me: the footer
 
- **File:** client/src/App.jsx and client/src/App.css
- **Commit:** [PASTE COMMIT LINK]
- **What it does and why it is built this way:** This shows at the bottom of every page in my web app. It also shows the app name with the cup icon from Flaticon, it also have my LinkedIn and GitHub links, and the copyright. The year comes from new Date().getFullYear(), so it changes by itself and I never have to edit it.
### Written by me: the buttons component
 
- **File:** client/src/App.jsx
- **Commit:** [PASTE COMMIT LINK]
- **What it does and why it is built this way:** I made the Button that I use everywhere in the app. It takes a variant, a size, and an icon, and it builds the CSS class names from that. In this way each button looks the same, and if I want to change how buttons look, I  can also change it in one place. The default type is "button", so that the button does not submit a form by accident.
### Written by me: the home page with the recent brews
 
- **File:** client/src/App.jsx 
- **Commit:** [PASTE COMMIT LINK]
- **What it does and why it is built this way:** The home page shows the three recent coffee beans that user brewed. The logs are already newest first, so logs.slice(0, 3) takes the first three and shows each one as a brew card. If a user clicks a card, it opens that brew in the Journal. Then if there are no logs yet, it will show a "No brews yet" message instead. And lastly the "Add a brew" button takes the user to the Log Brew page.
### Written by me: the Brew journal page and the BrewLogCard component
 
- **File:** client/src/App.jsx 
- **Commit:** [PASTE COMMIT LINK]
- **What it does and why it is built this way:** For the Journal page. If a log is opened, it shows the details such as the numbers, the star rating, the cupping bars, the flavor tags, and the notes that user inputted, with an Edit, Close, and Delete buttons. For the search bar, if nothing matches, it will show a "No brews match this search" message. 
### Written by me: the flavor picker component
 
- **File:** client/src/App.jsx
- **Commit:** [PASTE COMMIT LINK]
- **What it does and why it is built this way:** This is the component where the user picks their flavor notes for a brew. It has a search box and a row of category buttons. If the user types, then it will search the flavor list. And if the user clicks a category instead, it will show all the flavors in that category. Clicking a flavor runs the toggleTag, if the flavor is already picked, it takes it out, and if not, it will add it. The picked flavors also show a small × to remove them. I built it this way so the user can find a flavor fast by typing or by browsing.
### Written by me: the banner message
 
- **File:** client/src/App.jsx 
- **Commit:** [PASTE COMMIT LINK]
- **What it does and why it is built this way:** The banner is a small message box that pops up, like "Brew log saved." or "Couldn't save that bean." It gets a message and a type whether its error or success, and the type changes the color. I built it so that users can be notified if the beans and their logs is saved of not.
### Written by me: the navbar
 
- **File:** client/src/App.jsx
- **Commit:** [PASTE COMMIT LINK]
- **What it does and why it is built this way:** The navbar shows the logo, the app name, and a button for each page such as Home, Beans, Log Brew, Journal plus a log out/ exit button. When using on a phone, the links are hidden in a menu button. When the user picks a page, the goToPage changes the page and closes the menu. If the user is a guest, a banner will show that brews are saved on this device only, and the log out button will show "Exit guest mode" instead.
### Written by me: the edit and cancel functions for the forms
 
- **File:** client/src/App.jsx
- **Commit:** [PASTE COMMIT LINK]
- **What it does and why it is built this way:** The startEditBean remembers which bean is being edited, it fills the bean form with a bean's saved values, and will opens the form. It uses || '' so that a missing value becomes empty text and the inputs do not break. For the cancelBeanForm this closes the form, forgets the bean being edited, and puts the form back to its empty starting values. Then lastly is the cancelLogForm it does the same for the brew log form, and then takes the user back to the Home page. I made them so that Cancel will always leave the form clean.
### Written by me: the layout CSS for the stars, search bar, navbar, bean cards, journal details, log-in page, and flavor tags
 
- **File:** client/src/App.css
- **Commit:** [PASTE COMMIT LINK]
- **What it does and why it is built this way:** 
  - **Stars and search bar:** 
    - For the .star-rating this puts the stars in a row with a small gap, and 
    - .star-rating button will remove the default button look so that each star is clickable. 
    - .search-bar input this adds a padding on the left so that the typed text does not sit on top of the search icon.
  - **Navbar:** 
    - .navbar puts the logo on the left and the links on the right. 
    - .nav-brand and .nav-logo img keeps the logo and the app name together and it also make the logo fit.
  - **Bean cards:** 
    - .bean-card-inner and .bean-card-row this ensure to stack the bean info and spread the name and the details apart. 
    - .bean-buttons adds a space above the buttons.
  - **Journal details:** 
    - .detail-header puts the title on the left and the buttons on the right, while
    - .detail-title removes the extra space around the title.
  - **Log-in page:** 
    - The .auth-logo img makes the logo fit, and 
    - .auth-actions stacks the buttons in a column at a full width.
  - **Cupping and flavors:** 
    - The .cupping-slider-header puts a slider's label and a value on one line. 
    - While, .flavor-results and .flavor-selected let the flavor tags sit in a row and wrap to the next line when there is no more room.
### Written by me: the flavor wheel list and getFlavorName
 
- **File:** client/src/flavorWheel.js
- **Commit:** [PASTE COMMIT LINK]
- **What it does and why it is built this way:** For this file each flavor is saved as a path, like "Fruity > Berry > Blueberry". Then a loop goes through every category, then every group, every flavor, and adds each one to one big list. While the search uses that list. For getFlavorName it make sure to cut the path at every " > " and it keeps the last piece, so that the tag only shows as "Blueberry".
### Written by me: makeGuestId
 
- **File:** client/src/App.jsx
- **Commit:** [PASTE COMMIT LINK]
- **What it does and why it is built this way:** The guests have no database, so nobody gives their beans and brews an id. For this function it makes one by joining the word "guest", and the current time, and a short random piece, so no two ids are the same and will not break.
### The AI-written part I understand best: loading beans and logs (Promise.all)
 
- **File:** client/src/App.jsx (the useEffect that depends on session)
- **Commit:** [PASTE COMMIT LINK]
- **What it does and why I kept it:** This runs when the login changes. If nobody is signed in, then it will empty the database data and stops. If someone is signed in, then it turns on the dataLoading and sends the request for beans and the request for logs at the same time with Promise.all, then it will wait until both are back. For each of the result, if there is an error it shows a message. If not, then it will run the rows through beanFromDb or logFromDb and then saves them in state. Then it will turn the dataLoading off. I kept it so that the page does not show half-loaded data.
### The AI-written part I understand best: the log-in and sign-up submit (handleSubmit)
 
- **File:** client/src/Auth.jsx
- **Commit:** [PASTE COMMIT LINK]
- **What it does and why I kept it:** One form is used for both log in and sign up, this says if which one is on. When the user submits, the handleSubmit stops the page from reloading, and clears old messages, and turns on the loading. If the mode is log in, then it will call the  signInWithPassword. Otherwise it calls the signUp. If Supabase sends back an error, the error message is shown. After a sign-up, a message will also tell the user to check the email they used for the web app. I kept the Supabase calls because I did not know how to send the email and password safely, and I wrote the messages and the guest button myself.
