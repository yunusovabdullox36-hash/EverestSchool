# EverstSchool

Teacher/Student platform built with React + Vite.

## Features

- Landing page with two role cards: `Teacher` and `Student`
- Teacher login panel
- Teacher dashboard:
  - Profile info
  - `Add Student` form
  - AI helper section for generating tests by topic + level + question count
  - Assign generated tests to selected students
- Student login panel
- Student dashboard:
  - See total score
  - Open assigned tests
  - One-time test completion (completed tests become disabled/gray)
- Data seeded from `db.json` and persisted in browser `localStorage`
- Cross-tab real-time sync using `BroadcastChannel` + `storage` events

## Local Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Vercel

1. Push this project to GitHub.
2. In Vercel, click `Add New Project`.
3. Import your GitHub repository.
4. Framework preset: `Vite` (auto-detected).
5. Deploy.

`vercel.json` includes SPA rewrite so routes like `/teacher` and `/student` work directly.

## Default Accounts

- Teacher:
  - login: `teacher1`
  - password: `12345`
- Student:
  - login: `student1`
  - password: `12345`
