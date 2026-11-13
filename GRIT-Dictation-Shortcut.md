# GRIT - Dictate a Whole Workout (7 sections, ~5 minutes)

One Shortcut run fills all 7 slots for one athlete:
1. Dynamic Stretch | Warm Up
2. Core
3. Main Lift
4. Acceleration and Speed
5. Mindset
6. Homework
7. Remember, you are:

Coach Notes (5th block on the page) is NOT overwritten - the Apps Script keeps whatever is already there.

## Part 1 - Apps Script (once)
1. Go to script.google.com > New project, paste in `grit-dictation-apps-script.js`
2. Project Settings (gear) > Script Properties, add:
   - SUPABASE_URL = https://YOURPROJECT.supabase.co
   - SUPABASE_KEY = your Supabase anon key (same as in GRIT Coach > Supabase)
   - SHEET_ID = optional Google Sheet ID for a log (create a blank Sheet, copy the ID from its URL)
3. Deploy > New deployment > Web app
   - Execute as: Me
   - Who has access: Anyone (or Anyone within your org)
   - Deploy, copy the Web app URL (ends in /exec)

## Part 2 - Supabase (once)
In Supabase > SQL Editor, run `supabase.sql` from the GRIT zip.
It adds the `homework` column and creates `grit_training` with read/write policies.
Safe to run again - it uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS.

## Part 3 - iPhone Shortcut (once)
Shortcuts app > + > name it "Log GRIT Workout", then add these actions in order:

1. **Ask for Input** - Prompt: "Athlete name?" - Save as variable: Athlete
2. **Ask for Input** - Prompt: "Session? (e.g. Friday)" - Save as variable: Session
3. **Dictate Text** - Prompt: "Dictate Dynamic Stretch / Warm Up. Tap Done when finished." - Save as: Dynamic
   - Tip: say "Next" out loud is NOT needed - just talk, then tap Done. Speak for as long as you need.
4. **Dictate Text** - Prompt: "Dictate Core." - Save as: Core
5. **Dictate Text** - Prompt: "Dictate Main Lift." - Save as: MainLift
6. **Dictate Text** - Prompt: "Dictate Acceleration and Speed." - Save as: Acceleration
7. **Dictate Text** - Prompt: "Dictate Mindset." - Save as: Mindset
8. **Dictate Text** - Prompt: "Dictate Homework." - Save as: Homework
9. **Dictate Text** - Prompt: "Dictate Remember, you are..." - Save as: Remember
10. **Get Contents of URL**
    - URL: paste your Apps Script /exec URL
    - Method: POST
    - Request Body: JSON, with these keys (tap each value and pick the matching variable):
      athlete = Athlete, session = Session, dynamic = Dynamic, core = Core,
      mainLift = MainLift, acceleration = Acceleration,
      mindset = Mindset, homework = Homework, remember = Remember
11. **Show Result** - shows {"ok":true} or an error message if a name didn't match.

How to name a variable in Shortcuts: long-press the Dictate Text / Ask for Input action > Rename / or tap the blue variable chip and choose "Select Variable" after running once. If variables feel fiddly, an easier alternative: use **one** Dictate Text at the start and say the section names out loud ("Dynamic... Core..."), but the 7-prompt version above is far more reliable - each section lands in exactly the right box.

## Part 4 - Use it
Say: "Hey Siri, Log GRIT Workout"
- Type/pick the athlete, dictate each section when Siri asks, tap Done after each one.
- Total: about 5 minutes.
- Open GRIT > that athlete's Your GRIT Training page: the 4 workout sections are filled.
- Open Your Discipline: Homework, Mindset, and Remember, you are: are filled for that athlete.

## If it says an error
- "No athlete named X found" - the name must match GRIT exactly (check spelling in GRIT > Login/GRIT Athletes).
- "grit_training upsert failed" - run supabase.sql again in Supabase.
- "Load failed" / FetchEvent error - you are on an old sw.js. Re-upload the current GRIT zip (sw.js v2 never intercepts Google/Apps Script).


---

## Part 5 - Coach Notes dictation (same setup, second Shortcut)

Yes - use the exact same Apps Script /exec URL and the exact same Supabase tables. No new Apps Script deployment, no new keys.

Build a second Shortcut called **"Log Coach Notes"** - separate from the workout one, so in the evening you just say one phrase and talk:

1. **Ask for Input** - Prompt: "Athlete name?" - Save as: Athlete
2. **Dictate Text** - Prompt: "Dictate Coach Notes. Tap Done when finished." - Save as: CoachNotes
   - Talk as long as you need - 30 seconds or 5 minutes, same as the workout.
3. **Get Contents of URL**
   - URL: your same Apps Script /exec URL
   - Method: POST
   - Request Body: JSON, with these keys:
     - action = `coachNotes` (type this literally - it is NOT a variable)
     - athlete = Athlete (variable)
     - coachNotes = CoachNotes (variable)
4. **Show Result**

### Use it
Say: **"Hey Siri, Log Coach Notes"** > pick the athlete > dictate > Done.

### What it does
- It only touches the **Coach | Trainer Progress Notes** block (5th block) on that athlete's Your GRIT Training page.
- It **appends** - it does NOT overwrite the workout you dictated earlier that day, and it does NOT erase a coach note you already dictated.
- Each dictation gets a timestamp line, so the evening note stacks underneath the earlier one like this:
  ```
  [Nov 13, 8:42 PM] Great effort on main lift, needs to finish reps...
  [Nov 13, 9:15 PM] Follow-up: ankle was tight on acceleration...
  ```
- Open GRIT > that athlete > Your GRIT Training > Coach | Trainer Progress Notes: your evening note is there.

### Why a second Shortcut instead of one Shortcut that asks "Workout or Coach Notes?"
You can do it as one - add an "Ask for Input: Workout or Coach Notes?" at the top and an If action - but on the gym floor / late at night, two short Siri phrases ("Log GRIT Workout" vs "Log Coach Notes") are faster and you can't tap the wrong branch by mistake.

### If it errors
- "No athlete named X" - same as workout: name must match GRIT exactly.
- Note doesn't show up - refresh the training page. The site pulls from Supabase on load; if you already had that athlete's page open, pull-to-refresh / reopen it.
