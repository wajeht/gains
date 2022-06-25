
<template>
  <div class="container">
    <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
      <router-link
        to="/"
        class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none"
      >
        <img
          class="bi me-2"
          height="32"
          width="32"
          src="../../assets/images/logo.png"
          alt="logo"
          role="img"
        />
        <span class="fs-4">Simple header</span>
      </router-link>

      <ul class="nav nav-pills">
        <!-- home -->
        <li class="nav-item">
          <router-link to="/" class="nav-link" :class="{ active: $route.name === 'Home' }"
            >Home</router-link
          >
        </li>

        <!-- features -->
        <li class="nav-item">
          <router-link
            to="/features"
            class="nav-link"
            :class="{ active: $route.name === 'Features' }"
            >Features</router-link
          >
        </li>

        <li class="nav-item"><a href="#" class="nav-link">Pricing</a></li>
        <li class="nav-item"><a href="#" class="nav-link">FAQs</a></li>
        <li class="nav-item"><a href="#" class="nav-link">About</a></li>
      </ul>
    </header>
  </div>
</template>
