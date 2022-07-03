<template>
  <!-- header -->
  <DashboardHeader />

  <!-- contact -->
  <div class="container px-3">
    <div class="my-3 d-flex flex-column gap-3">
      <!-- go back -->
      <a class="link-secondary text-decoration-none" @click="$router.back()" role="button"
        ><i class="bi bi-arrow-left"></i> Back</a
      >

      <!-- contact -->
      <div class="card">
        <div class="card-body">
          <Contact />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Contact from '../../components/shared/Contact.vue';
  import DashboardHeader from '../../components/dashboard/DashboardHeader.vue';

  export default {
    components: {
      Contact,
      DashboardHeader,
    },
  };
</script>
