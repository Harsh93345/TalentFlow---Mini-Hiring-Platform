# TALENTFLOW – A Mini Hiring Platform

TALENTFLOW is a front-end-only React application designed to simulate a mini hiring platform for an HR team. It allows for the management of jobs, candidates, and job-specific assessments, with all data persisted locally in the browser.

[![React](https://img.shields.io/badge/React-v18.2-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-v5.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## Live Demo & Repository

- **Deployed App:** https://talent-flow-mini-hiring-platform-two.vercel.app/
- **GitHub Repo:** https://github.com/Harsh93345/TalentFlow---Mini-Hiring-Platform.git

## Features

### 1. Job Management
- **Interactive Jobs Board:** List jobs with server-like pagination and filtering by title, status, and tags.
- **CRUD Operations:** Create and edit jobs within a modal or a dedicated route, featuring robust form validation.
- **Drag-and-Drop Reordering:** Easily reorder jobs on the board with optimistic UI updates and a rollback mechanism for API failures.
- **State Management:** Archive and unarchive jobs to manage visibility.
- **Deep Linking:** Access any job directly via its unique URL (`/jobs/:jobId`).

### 2. Candidate Tracking
- **High-Performance List:** Browse 1,000+ seeded candidates in a virtualized list for a smooth, lag-free experience.
- **Advanced Search & Filter:** Utilize client-side search for name/email and server-like filtering for the candidate's current stage.
- **Kanban Board:** Visually track and move candidates through hiring stages (`applied`, `screen`, `tech`, etc.) via drag-and-drop.
- **Detailed Candidate Profiles:** View a candidate's profile and a complete timeline of their status changes at `/candidates/:id`.
- **Notes with @mentions:** Attach notes to candidate profiles, with a simple UI highlight for @mentions.

### 3. Dynamic Assessments
- **Per-Job Assessment Builder:** Create custom assessments for each job, composed of sections and various question types (single/multi-choice, text, numeric, file upload stub).
- **Live Preview:** See a real-time preview of the assessment form as you build it.
- **Robust Form Runtime:** A candidate-facing form with built-in validation rules (required, numeric range, etc.) and conditional logic (e.g., show Q3 only if Q1 is "Yes").
- **Local Persistence:** The builder's state and candidate responses are saved locally, ensuring no data is lost.

## Tech Stack & Architecture

This project uses a modern, performant, and scalable front-end architecture.

- **Framework:** React (with Vite) & TypeScript
- **API Simulation:** Mock Service Worker (MSW) to simulate a REST API with artificial latency and error rates.
- **Local Persistence:** Dexie.js (a wrapper for IndexedDB) to act as the local database, ensuring state persists on refresh.
- **State Management:** TanStack Query (React Query) for server state management (caching, optimistic updates, data fetching).
- **Styling:** Tailwind CSS with shadcn/ui for a utility-first workflow and accessible component primitives.
- **Drag & Drop:** @dnd-kit for performant and accessible drag-and-drop functionality.
- **Forms:** React Hook Form & Zod for efficient and type-safe form validation.
- **Routing:** React Router DOM for client-side routing.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- `npm` or `yarn`

### Setup & Installation
1.  **Clone the repository:**
    ```sh
    git clone [LINK TO YOUR GITHUB REPO]
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd talentflow
    ```
3.  **Install dependencies:**
    ```sh
    npm install
    ```
4.  **Run the development server:**
    ```sh
    npm run dev
    ```


## Architecture & Technical Decisions

### Architecture Overview
The application is a true front-end-only SPA.
1.  **MSW (API Layer):** Mock Service Worker intercepts all outgoing `fetch` requests. Instead of hitting a real network, it redirects them to mock resolver functions.
2.  **Dexie.js (Persistence Layer):** These resolver functions interact with a Dexie.js database, which is a wrapper around the browser's IndexedDB. This acts as our "database," allowing data to be created, read, updated, and deleted.
3.  **TanStack Query (State Management):** The React application uses TanStack Query to fetch data from the MSW "API." It handles all caching, request lifecycle states (loading, error, success), and complex patterns like optimistic updates for a seamless user experience.

### Key Technical Decisions
- **Why TanStack Query?** It is perfectly suited for managing server state in a complex application. Its built-in support for caching, background refetches, and optimistic updates with rollback was essential for meeting the project requirements efficiently.
- **Why MSW + Dexie.js?** This combination flawlessly simulates a full-stack environment. MSW provides a non-intrusive way to mock an API at the network level, while Dexie abstracts away the complexities of IndexedDB, providing a robust local database that fulfills the core persistence requirement.
- **Why `@dnd-kit`?** It's a modern, accessible, and high-performance library for drag-and-drop, making it the ideal choice for both the job list reordering and the Kanban board features.
- **Why shadcn/ui?** It provides a set of beautifully designed and accessible components that are unstyled by default, allowing for full customization with Tailwind CSS while accelerating development.