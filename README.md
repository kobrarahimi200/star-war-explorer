# Star Wars Explorer (`star-war-explorer`)

Star Wars Explorer is a Vue.js application created for the FIS-Gruppe Vue.js code challenge. It provides a searchable, filterable, and bookmarkable Star Wars character and film experience using the public read-only API at [swapi.info](https://swapi.info).

The application includes character and film categories, detail views, resolved relationships between people and films, client-side CRUD operations, URL-synchronized filters, favorites, dark mode, and undoable deletion.

## 🚀 Prerequisites & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher recommended
- npm

### Step 1: Clone the repository

```bash
git clone https://github.com/kobrarahimi200/star-war-explorer.git
cd star-war-explorer
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Step 4: Type-check and build for production

```bash
npm run build
```

This runs the Vue TypeScript compiler and creates an optimized Vite production build.

### Step 5: Preview the production build locally

```bash
npm run preview
```

## 🛠️ Tech Stack & Dependencies

- **Vue 3.5** — Composition API with `<script setup lang="ts">`
- **TypeScript** — Strict type checking and typed application models
- **Pinia** — Central state management and client-side persistence merge layer
- **Vue Router** — View routing and URL query-parameter synchronization
- **Tailwind CSS** — Responsive layout, typography, component styling, and dark mode
- **Vite** — Fast development server and production build tool
- **Vitest** — Unit testing for store and query-state behavior

## ⚙️ How It Was Implemented

### Master Store & Client-Side Persistence

The Pinia store is the central source for API data and client-side application state.

- People and films are loaded from the read-only SWAPI endpoints.
- API people are stored separately from `localPeople`.
- Local edits and custom characters are persisted in `localStorage`.
- `allPeople` merges API records with local records.
- Local records override API records when they share the same ID.
- Deleted IDs are persisted separately and filtered from the merged list.
- Create, edit, and delete operations never call a write endpoint.

This provides client-side CRUD behavior while keeping the public API read-only.

### URL Query State Synchronization

People overview controls use `useRoute().query` as their single source of truth:

- `q` stores the search query.
- `gender` stores the selected gender filter.
- `sort` stores the selected sorting mode.
- `favorites=true` enables Favorites Only mode.

Changes are written with `router.replace()`. Empty values and defaults are omitted to keep URLs clean. As a result, filter state survives a browser refresh and can be shared through deep links, for example:

```text
/?q=luke&gender=male&sort=height-desc&favorites=true
```

### Bi-Directional Entity Relationships

People and films retain their SWAPI resource URLs so relationships can be resolved on the client:

- A character's film URLs are resolved into human-readable film records on `/people/:id`.
- A film's character URLs are resolved into character names and links on `/films/:id`.
- Film cards and character badges provide direct navigation between related entities.

### Favorites Bookmarking System

Favorites are managed by Pinia and persisted under `swapi_favorites` in `localStorage`.

- Users can bookmark or unbookmark characters from cards and detail views.
- The Favorites navigation action opens the overview with `favorites=true`.
- Favorites Only mode continues to support search, gender filtering, and sorting.
- Deleting a character removes its favorite state; undo restores it when appropriate.

## 📋 Included Features & Application Modules

### People Overview & Detail Views

- People overview at `/`
- Search by character name
- Gender filtering
- Sorting by name and height
- Responsive grid view
- Client-side rendering suitable for the small SWAPI dataset
- Character detail view at `/people/:id`
- Resolved film relationships
- Favorite, edit, and delete actions

### Films Category & Detail Views

- Films overview at `/films`
- Film title search
- Responsive film grid
- Film detail view at `/films/:id`
- Episode number
- Director
- Producer
- Release date
- Opening crawl
- Linked appearing characters
- Navigation between related people and films

### Client-Side CRUD

- Add custom characters through a modal form
- Edit existing API or custom character records locally
- Delete characters with confirmation
- Persist local changes using `localStorage`
- Undo deletion within five seconds using the toast notification

### UX Enhancements

- Dark mode theme toggle
- Theme persistence using `localStorage`
- Responsive Tailwind CSS layout
- URL-persistent filters
- Accessible form validation for character names
- Floating Undo Delete toast notification
- Loading, error, empty, and not-found states

## 📄 Status Report (Abgabe / Probedokumentation)

### Completed Requirements

- Read-only integration with `https://swapi.info`
- Vue 3.5 Composition API implementation
- TypeScript strict typing across views, components, routes, and stores
- Pinia central state management
- Client-side Create, Edit, and Delete operations
- `localStorage` persistence for custom records, deleted IDs, favorites, and theme
- People and Films category views
- People and Film detail routes
- Search, gender filtering, and sorting
- URL query-parameter synchronization
- Favorites / bookmarks
- Resolved People ↔ Films relationships
- Responsive Tailwind CSS layout
- Dark mode toggle
- Undo Delete toast notification
- Unit tests for store behavior and query synchronization
- Production type-check and build validation

### Architectural Trade-offs

Virtual scrolling was intentionally omitted. The available dataset is small, approximately 82 records, so client-side filtering, sorting, and grid rendering are sufficient. Avoiding a virtualization dependency keeps the application simpler and reduces library overhead without affecting the user experience.

### Future Road Map

- Add end-to-end testing with Playwright.
- Add PWA support and Service Worker caching.
- Add richer film filtering and sorting.
- Improve relationship loading with cached resource metadata.
- Add centralized toast and notification composables.
