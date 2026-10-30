# Mobile Comms Midterm

A study and quiz website for the Mobile Communications midterm. Everything runs in the browser: no server, no build step, no accounts.

## What's inside

- **Learn**: 10 lessons written for someone who missed every lecture (Lecture 1 introduction and GSM, Lecture 2 cellular concept and frequency reuse, the Interference & SIR notes, Lecture 3 channel assignment and handoff), plus Sheets 1 and 2 solved step by step.
- **Practice**: build a set by lecture, question type and difficulty. Practice mode shows the answer after each question; exam mode marks everything at the end.
- **Midterm papers**: Midterm Practice A (fixed, 42 questions, 90 min), Midterm Practice B (new balanced paper every time), a sheet drill, a 10-minute sprint and a calculation workout with freshly generated numbers.
- **Quiz builder**: create your own quiz templates, pull questions from the bank, take them, export/import them as `.json`, or share them as a link.
- **Formulas & tools**: one-page formula sheet, a cluster/SIR designer, a channel calculator and an interactive frequency-reuse explorer.

Question bank: 198 hand-written questions (multiple choice, select-all, true/false, numeric, short answer) plus 13 problem generators. Every numeric answer is computed in code, so automatic marking is exact. Numeric answers accept normal rounding.

## Put it on GitHub Pages

1. Create a new **public** repository on GitHub (for example `mobile-comms-midterm`).
2. Upload everything in this folder, keeping the structure:
   ```
   index.html
   .nojekyll
   README.md
   assets/css/styles.css
   assets/js/lessons.js
   assets/js/questions.js
   assets/js/generators.js
   assets/js/app.js
   ```
   On the repository page: **Add file → Upload files**, drag the files and the `assets` folder in, then **Commit changes**.
3. Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose the `main` branch and the `/ (root)` folder, then **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/<repository-name>/`. Send that link to your classmates.

You can also open `index.html` directly from your computer; everything except share links works offline (the Inter font falls back to the system font).

## Editing the content

- Lessons: `assets/js/lessons.js`
- Questions: `assets/js/questions.js` (types and fields are documented at the top of the file)
- Generated problems: `assets/js/generators.js`

## Notes on the model answers

While building the bank, every sheet answer was recalculated. A few small slips in the handwritten model answers are corrected (and explained) in the lessons:

- Sheet 1 Q1 lists 14 as a cluster size; i = 3, j = 2 gives 19, and 14 is not valid.
- Sheet 2 Q3: for N = 3 and 4 the exact C/I values are 7.49 dB and 9.49 dB (rounding).
- Sheet 2 Q5: Δ ≈ 1.09 dB. It is a difference of two dBm levels, so its unit is dB.
- SIR notes, Example 1: (4.583)⁴/6 = 73.5 (the slide prints 75.3; the 18.66 dB value is correct).

Scores, progress and your own quizzes are stored in your browser's local storage only.
