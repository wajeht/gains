<template>
  <div class="d-flex flex-column justify-content-evenly" style="min-height: calc(100vh - 170px)">
    <!-- hero -->
    <div class="text-center px-4 pb-5 border-bottom mx-auto">
      <!-- alert -->
      <div
        class="
          alert alert-warning
          mb-3
          py-2
          mx-auto
          px-3
          animate__animated animate__fadeInDown
          d-block
        "
        style="width: fit-content"
      >
        <small>
          We are building Gains live at 8:00 PM (EDT). Join us via
          <a
            class="alert-link text-decoration-none"
            href="https://discord.com/channels/988167900420534273/989628732895543296"
            target="_blank"
          >
            Discord!
            <i class="bi bi-discord"></i>
          </a>
        </small>
      </div>

      <!-- title -->
      <h1 class="display-4 fw-bold animate__animated animate__fadeIn">
        Let's make all kinds of gains!
      </h1>

      <!-- description -->
      <div class="col-lg-6 mx-auto animate__animated animate__fadeIn">
        <p class="lead mb-4">
          The premier rep tracking and one rep max calculation application. Having trouble with any
          specific obstacles within your program? Just want to improve an individual lift?
          allkindsagains will enable you to accurately and easily track your progression.
        </p>

        <!-- button -->
        <div class="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
          <router-link to="/signup" class="hvr-grow btn btn-dark btn-lg px-4 me-sm-3"
            >Sign up</router-link
          >
          <router-link to="/features" class="hvr-grow btn btn-outline-secondary btn-lg px-4"
            >Learn more</router-link
          >
        </div>
      </div>

      <!-- image -->
      <div class="px-5">
        <img
          src="../../assets/images/hero.png"
          class="img-fluid rounded-3 mb-4"
          alt="gains app screenshot"
        />
      </div>
    </div>

    <!-- features -->
    <div class="px-4 py-5">
      <div class="row g-4 row-cols-1 row-cols-lg-3">
        <!-- easy -->
        <div class="feature col" data-aos="fade-up">
          <div class="p-2 d-flex justify-content-center align-items-center">
            <i class="bi bi-hand-index-thumb" style="font-size: 5em"></i>
          </div>
          <h2 class="text-center">Easy to use</h2>
          <p class="text-center">Sign up with your email. No complicated setup required!</p>
        </div>

        <!-- open source -->
        <div class="feature col" data-aos="fade-up">
          <div class="p-2 d-flex justify-content-center align-items-center">
            <i class="bi bi-github" style="font-size: 5em"></i>
          </div>
          <h2 class="text-center">Open source</h2>
          <p class="text-center">
            This project is open sourced. You can go check it out via
            <a href="https://github.com/allkindsofgains/gains" class="link-dark" target="_blank"
              >Github!</a
            >
          </p>
        </div>

        <!-- privacy -->
        <div class="feature col" data-aos="fade-up">
          <div class="p-2 d-flex justify-content-center align-items-center">
            <i class="bi bi-shield-check" style="font-size: 5em"></i>
          </div>
          <h2 class="text-center">Private</h2>
          <p class="text-center">
            We collect what you feel like giving us. Nothing more, nothing less!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Typed from 'typed.js';

  export default {
    data() {
      return {
        title: '',
      };
    },
  };
</script>
