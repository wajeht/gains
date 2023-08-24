<script setup>
import Backheader from '../../../../components/dashboard/headers/Backheader.vue';
</script>

<template>
  <!-- header -->
  <Backheader />

  <div class="container px-3 animate__animated animate__fadeIn animate__faster">
    <div class="my-3 d-flex flex-column gap-3">
      <div class="card">
        <div class="card-body">
          <h1>Help and Support</h1>
          <p class="fw-light">
            Here are list of questions commonly asked. If you do not find what you are looking for
            feel free to drop us a question
            <router-link to="/dashboard/settings/others/send-feedback">here!</router-link>
          </p>

          <!-- 1 -->
          <span>
            <h5>1. What's up with asking age and weight when signing up for an account?</h5>
            <p class="fw-light">
              You really don't need to use your real information to create an account. We are
              storing those data for future features build: a feature to locate yourself with
              OpenPowerlifting database. In terms of your competition history, meet and etc.
            </p>
          </span>

          <!-- 3 -->
          <span>
            <h5>2. How is this different than logging videos at Instagram like other lifters?</h5>
            <p class="fw-light">
              Well, Instagram stored your digital finger prints with an intend of selling your data
              to advertisers. So that way they can sell targeted ads towards users. We don't do any
              of that!
            </p>
          </span>

          <!-- 2 -->
          <span>
            <h5>3. Is the mobile app coming soon in future development?</h5>
            <p class="fw-light">
              As soon as our schedules allow us, we will start planning for mobile app development.
              Stay tune with our mailing list!
            </p>
          </span>

          <!-- 4 -->
          <span>
            <h5>4. In terms of my data, is there an option to complete wipe it from this app?</h5>
            <p class="fw-light">
              Yes, we have built one click to delete feature. We know theres nothing worse than an
              app that refuses to go away!
            </p>
          </span>

          <span>
            <h5>5. Is this app going to be free forever, what are the limitation?</h5>
            <p class="fw-light">
              Yes and No. The app is free but at this moment currently, you can only upload videos
              which are less than 10mb.
            </p>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
