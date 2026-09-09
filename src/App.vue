<script setup lang="ts">
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
    </main>
  </div>
</template>