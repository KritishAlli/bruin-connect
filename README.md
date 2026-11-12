# Bruin Connect 🐻💙💛

> See what's happening around campus and find people to do it with.

Bruin Connect is a web app for UCLA students to post and discover low-stakes, real-time plans around campus: "Anyone want to grab dinner at Bplate at 6?", "Looking for a lifting partner at Wooden at 4pm", "Study group at Powell tonight, 2 spots open."

This is also a **team learning project**. The goal is for everyone to come away with real experience building a full-stack web app _as a group_: using Git branches, pull requests, code review, issue tracking, and short sprints. Shipping something we'd actually use is the bonus.

---

## Table of Contents

1. [The Problem](#the-problem)
2. [Core Concepts](#core-concepts)
3. [MVP Scope](#mvp-scope)
4. [User Stories](#user-stories)
5. [Tech Stack](#tech-stack)
6. [Data Model (Draft)](#data-model-draft)
7. [Project Structure](#project-structure)
8. [Getting Started](#getting-started)
9. [How We Work](#how-we-work)
10. [Roadmap & Milestones](#roadmap--milestones)
11. [Workstreams](#workstreams)
12. [Safety & Privacy](#safety--privacy)
13. [Open Questions](#open-questions)

---

## The Problem

Plenty of students want company for everyday things: eating, working out, studying, going to events. But group chats are fragmented, and asking "anyone free?" in a 300-person GroupMe feels awkward. There's no single place to see **what's happening, where, and when** across campus, and to join in.

**Bruin Connect is that place.**

## Core Concepts

| Term         | Meaning                                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **Post**     | A plan someone wants company for. Has an activity, a location, a time, and an optional cap on how many people can join. |
| **Location** | A known campus spot: dining halls, gyms, libraries, etc. Posts are browsed by location.                                 |
| **Category** | The type of activity: 🍽️ Food, 🏋️ Fitness, 📚 Study, 🎉 Social, ⚽ Sports, ✨ Other.                                    |
| **Join**     | A user signaling "I'm in." The poster sees who joined.                                                                  |
| **Expiry**   | Posts disappear automatically after their start time passes, so the feed always shows what's coming up.                 |

### Seed Locations

Start with a fixed list (we can add more later):

- **Dining:** Bruin Plate (Bplate), De Neve, Epicuria at Covel, Feast at Rieber, Bruin Café, Rendezvous, The Study at Hedrick
- **Fitness:** John Wooden Center, Bruin Fitness Center (BFit), Sunset Canyon Recreation Center
- **Study:** Powell Library, Young Research Library (YRL), Ackerman Union
- **Outdoors/Social:** Janss Steps, Drake Stadium, Intramural Field, Royce Quad

---

## MVP Scope

The MVP is the **smallest thing that's actually useful**. We ship this first, then iterate.

### ✅ In scope (MVP)

- Sign up / log in with a **UCLA email** (`@ucla.edu` / `@g.ucla.edu` only)
- Create a post: title, category, location, date/time, optional description, optional max group size
- Browse a feed of upcoming posts
- Filter the feed by **location** and **category**
- View a post's details and who has joined
- Join / leave a post
- Edit / delete your own posts
- Posts auto-hide once their time has passed
- Basic user profile: display name, year, optional major, optional emoji/avatar
- Mobile-friendly layout (most people will use this on their phone)

### 🚫 Out of scope (for now)

- In-app chat/DMs (posts can include a contact method, e.g. Instagram handle)
- Push notifications
- Native mobile apps
- Friends/following
- Map view (great stretch goal; see roadmap)

---

## User Stories

These map directly to GitHub Issues. Format: _As a [user], I want [action] so that [benefit]._

**Auth & Profile**

- As a student, I want to sign in with my UCLA email so that only Bruins are on the app.
- As a user, I want to set a display name and year so that others know who they're meeting.

**Posting**

- As a user, I want to create a post with a location and time so that others can join my plan.
- As a poster, I want to set a max group size so that my dinner doesn't turn into 15 people.
- As a poster, I want to edit or delete my post if plans change.

**Discovering**

- As a user, I want to see all upcoming posts sorted by time so that I can find something to do soon.
- As a user, I want to filter by location (e.g. only Wooden) so that I see what's near me.
- As a user, I want to filter by category (e.g. only Food) so that I find what I'm in the mood for.

**Joining**

- As a user, I want to join a post so that the poster knows I'm coming.
- As a user, I want to leave a post I joined if I can't make it.
- As a poster, I want to see who joined my post.

**Safety**

- As a user, I want to report a post that's inappropriate so that the app stays a good space.

---

## Tech Stack

Chosen to be **beginner-friendly, free to host, and widely used in industry**, so the skills transfer.

| Layer              | Choice                                                          | Why                                                                           |
| ------------------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Framework          | [Next.js 16](https://nextjs.org/) (App Router) + **TypeScript** | One codebase for frontend and backend; huge community; types catch bugs early |
| Styling            | [Tailwind CSS](https://tailwindcss.com/)                        | Fast to build with, consistent design, no CSS file sprawl                     |
| Database + Auth    | [Supabase](https://supabase.com/) (Postgres)                    | Free tier, built-in email auth, real SQL, nice dashboard                      |
| Hosting            | [Vercel](https://vercel.com/)                                   | Free, auto-deploys every PR to a preview URL                                  |
| Linting/Formatting | ESLint + Prettier                                               | Keeps code style consistent across contributors                               |
| Testing            | Vitest (unit) + Playwright (stretch)                            | Lightweight, modern                                                           |

> **Not set in stone.** If the team strongly prefers something else (e.g. Firebase, or a separate Express backend), raise it in the kickoff meeting. We'll decide once and commit.

---

## Data Model (Draft)

```
users
  id            uuid (PK, from Supabase auth)
  email         text (must end in ucla.edu)
  display_name  text
  year          text   -- "1st", "2nd", "3rd", "4th", "Grad"
  major         text?  -- optional
  avatar_emoji  text?  -- optional
  created_at    timestamp

locations
  id            serial (PK)
  name          text   -- "Bruin Plate"
  short_name    text   -- "Bplate"
  type          text   -- "dining" | "fitness" | "study" | "social"

posts
  id            uuid (PK)
  author_id     uuid  -> users.id
  location_id   int   -> locations.id
  category      text  -- "food" | "fitness" | "study" | "social" | "sports" | "other"
  title         text
  description   text?
  starts_at     timestamp
  max_people    int?  -- null = no limit
  contact       text? -- optional, e.g. "@insta_handle"
  created_at    timestamp

post_members
  post_id       uuid -> posts.id
  user_id       uuid -> users.id
  joined_at     timestamp
  PRIMARY KEY (post_id, user_id)

reports
  id            uuid (PK)
  post_id       uuid -> posts.id
  reporter_id   uuid -> users.id
  reason        text
  created_at    timestamp
```

---

## Project Structure

Proposed layout once the app is scaffolded:

```
bruin-connect/
├── app/                  # Next.js routes (pages + API)
│   ├── page.tsx          # Home feed
│   ├── login/            # Auth
│   ├── posts/
│   │   ├── new/          # Create post
│   │   └── [id]/         # Post detail
│   └── profile/          # User profile
├── components/           # Reusable UI (PostCard, FilterBar, Navbar, ...)
├── lib/                  # Supabase client, helpers, types
├── supabase/
│   ├── migrations/       # SQL schema changes (checked into git!)
│   └── seed.sql          # Seed locations
├── public/               # Static assets
├── .env.example          # Env var template (never commit real .env)
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20.9+ (22 LTS recommended)
- [Git](https://git-scm.com/)
- A GitHub account (added as a collaborator on this repo)
- Access to the team Supabase project (ask the PM)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/KritishAlli/bruin-connect.git
cd bruin-connect

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (ask the PM)

# 4. Run the dev server
npm run dev
# Open http://localhost:3000
```

### Useful scripts

| Command                | What it does                                                    |
| ---------------------- | --------------------------------------------------------------- |
| `npm run dev`          | Start the dev server with hot reload                            |
| `npm run build`        | Production build (run this before opening a PR to catch errors) |
| `npm run lint`         | Check code with ESLint                                          |
| `npm run format`       | Auto-format everything with Prettier                            |
| `npm run format:check` | Check formatting without changing files                         |

> 💡 Install the **ESLint**, **Prettier**, and **Tailwind CSS IntelliSense** extensions in VS Code and turn on _Format on Save_.

---

## How We Work

This section matters as much as the code. Following it is how we get real team-dev experience.

### 1. Everything starts as an Issue

- All work is tracked in **GitHub Issues** and organized on the **GitHub Projects board** (`Backlog → To Do → In Progress → In Review → Done`).
- Before you start something, **assign the issue to yourself** and move it to _In Progress_.
- Issues labeled `good first issue` are intentionally small; grab one if you're new.

### 2. Branching

- **Never commit directly to `main`.** `main` should always work.
- Create a branch per issue, named `<type>/<issue#>-<short-description>`:
  ```
  feature/12-create-post-form
  fix/31-feed-timezone-bug
  chore/5-setup-eslint
  ```

### 3. Commits

Use clear, present-tense messages (loosely following [Conventional Commits](https://www.conventionalcommits.org/)):

```
feat: add location filter to feed
fix: hide posts after start time passes
docs: update setup steps in README
```

### 4. Pull Requests

- Open a PR into `main` when your work is ready (or a **Draft PR** early if you want feedback).
- Link the issue in the description: `Closes #12`.
- Include **screenshots** for any UI change.
- Every PR needs **at least 1 approving review** from a teammate before merging.
- Use **Squash and merge** to keep history clean.
- Delete your branch after merging.

### 5. Code Review Etiquette

- Review within **48 hours** when you're requested.
- Be kind and specific. Ask questions ("What happens if `max_people` is null here?") rather than make demands.
- Prefix optional suggestions with `nit:`.
- Reviewing is one of the best ways to learn the codebase, so everyone reviews, not just the most experienced people.

### 6. Meetings

| Meeting         | When                  | Length | Purpose                                      |
| --------------- | --------------------- | ------ | -------------------------------------------- |
| Sprint Planning | Start of each sprint  | 45 min | Pick issues for the next 2 weeks             |
| Async Standup   | 3x/week in group chat | 2 min  | _What I did / what I'm doing / any blockers_ |
| Demo + Retro    | End of each sprint    | 45 min | Show what we built; discuss what to improve  |

### 7. Definition of Done

An issue is **Done** when:

- [ ] Code is merged into `main`
- [ ] It works on mobile and desktop widths
- [ ] No lint errors
- [ ] A teammate reviewed it
- [ ] Any new env vars or setup steps are documented here

---

## Roadmap & Milestones

Two-week sprints. Dates are targets, not deadlines; we adjust at each retro.

### 🏁 Sprint 0: Setup (Week 1)

- [ ] Kickoff meeting: confirm stack, roles, meeting times
- [x] Scaffold Next.js + TypeScript + Tailwind app
- [x] Set up ESLint, Prettier, and `.env.example`
- [ ] Create Supabase project and initial schema migration
- [ ] Seed the `locations` table
- [ ] Connect Vercel for preview deploys
- [ ] Every team member opens and merges one tiny PR (e.g. add your name to [Contributors](#contributors)), to practice the workflow

### 🧱 Sprint 1: Foundations (Weeks 2–3)

- [ ] UCLA-email-only sign up / log in
- [ ] Profile setup page
- [ ] Navbar + base layout + design tokens (colors, fonts)
- [ ] Create Post form (with validation)
- [ ] Basic feed listing upcoming posts

### 🔗 Sprint 2: Core Loop (Weeks 4–5)

- [ ] Post detail page
- [ ] Join / leave post (respecting `max_people`)
- [ ] Edit / delete own posts
- [ ] Filter feed by location and category
- [ ] Auto-hide expired posts

### 🚀 Sprint 3: Polish & Launch (Weeks 6–7)

- [ ] Report a post
- [ ] Empty states, loading states, error messages
- [ ] Mobile polish pass
- [ ] Accessibility pass (labels, contrast, keyboard nav)
- [ ] Soft launch to friends and collect feedback

### 🌟 Stretch Goals (post-MVP)

- 🗺️ **Map view** of campus with live post pins
- 🔔 Notifications when someone joins your post
- 💬 Simple comment thread on posts
- 🍽️ Pull in **today's dining hall menus** next to food posts
- 🏋️ Show gym busyness / hours
- 🔁 Recurring posts ("Leg day at Wooden every Tue/Thu")
- 🎓 Filter by class (e.g. "studying for CS 35L")

---

## Workstreams

Everyone should touch **both** frontend and backend over the course of the project. Workstreams are "home bases," not silos, and we'll rotate at least once.

| Workstream             | Focus                                         | Owner(s) |
| ---------------------- | --------------------------------------------- | -------- |
| **Auth & Users**       | Login, UCLA email restriction, profiles       | _TBD_    |
| **Posts & Feed**       | Create/edit/delete posts, feed, filters       | _TBD_    |
| **Joining & Social**   | Join/leave, member lists, reports             | _TBD_    |
| **UI / Design System** | Layout, components, mobile, accessibility     | _TBD_    |
| **DevOps & Data**      | Supabase schema, migrations, Vercel, CI       | _TBD_    |
| **Product / PM**       | Backlog, sprint planning, reviews, unblocking | _PM_     |

---

## Safety & Privacy

Meeting strangers is the whole point, so we need to take this seriously from day one.

- **UCLA-only:** Accounts require a verified UCLA email.
- **Public places only:** Locations are restricted to a list of public campus spots. No dorm room numbers or off-campus addresses.
- **Minimal data:** We only collect what we need. Email is never shown publicly.
- **Reporting:** Any post can be reported; reported posts are reviewed by the team.
- **Row-Level Security:** Supabase RLS policies ensure users can only edit/delete their own data.
- **No secrets in git:** API keys live in `.env.local` (git-ignored). If you accidentally commit a secret, tell the PM immediately so we can rotate it.

---

## Open Questions

To discuss at kickoff. Add yours via a PR!

1. What should we call the app? (Working name: **Bruin Connect**)
2. Should posts require a max group size, or keep it optional?
3. How far in advance can people post? (Same day only? Up to a week?)
4. Do we allow "looking for" posts with no fixed time ("anyone want to get boba this week?")?
5. Who moderates reports, and how quickly?

---

## Contributors

_Add yourself here as your first PR!_

| Name | GitHub | Workstream |
| ---- | ------ | ---------- |
|      |        |            |

---

_Built by Bruins, for Bruins. Go Bruins! 💙💛_
