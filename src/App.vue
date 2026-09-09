<script setup lang="ts">
const people = [
  {
    id: '1',
    name: 'Luke Skywalker',
    gender: 'Male',
    height: '172 cm',
    homeworld: 'Tatooine',
  },
  {
    id: '2',
    name: 'Leia Organa',
    gender: 'Female',
    height: '150 cm',
    homeworld: 'Alderaan',
  },
  {
    id: '3',
    name: 'Han Solo',
    gender: 'Male',
    height: '180 cm',
    homeworld: 'Corellia',
  },
]
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Star Wars Explorer</h1>

      <nav>
        <button>People</button>
        <button>Starships</button>
        <button>⭐ Favorites</button>
      </nav>
    </header>

    <main class="main">
      <h2>People</h2>

      <section class="filters">
        <input
            type="text"
            placeholder="Search people..."
        />

        <select>
          <option>All genders</option>
          <option>Male</option>
          <option>Female</option>
          <option>Unknown</option>
        </select>

        <select>
          <option>Name A → Z</option>
          <option>Name Z → A</option>
          <option>Height ↑</option>
          <option>Height ↓</option>
        </select>
      </section>
      <section class="people-list">
        <article
            v-for="person in people"
            :key="person.id"
            class="person-card"
        >
          <div>
            <h3>{{ person.name }}</h3>

            <p>
              {{ person.gender }} · {{ person.height }}
            </p>

            <p>
              Homeworld: {{ person.homeworld }}
            </p>
          </div>

          <button>☆</button>
        </article>
      </section>
    </main>
  </div>
</template>
<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Inter, system-ui, sans-serif;
  background: #f5f5f7;
  color: #1f2937;
}

button,
input,
select {
  font: inherit;
}

.app {
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
  background: #111827;
  color: white;
}

.header h1 {
  margin: 0;
  font-size: 24px;
}

.header nav {
  display: flex;
  gap: 10px;
}

.header button {
  border: 0;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px;
}

.main h2 {
  margin-bottom: 24px;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.filters input,
.filters select {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
}

.filters input {
  flex: 1;
}

.people-list {
  display: grid;
  gap: 12px;
}

.person-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.person-card h3 {
  margin: 0 0 8px;
}

.person-card p {
  margin: 4px 0;
  color: #6b7280;
}

.person-card button {
  border: 0;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
}
</style>