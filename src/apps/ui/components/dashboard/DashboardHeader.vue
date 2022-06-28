<template>
  <div
    class="
      container
      sticky-top
      d-flex
      justify-content-between
      align-items-center
      bg-white
      border-bottom
      py-2
      gap-3
    "
  >
    <!-- profile image -->
    <div>
      <img
        class="rounded"
        width="25"
        height="25"
        src="../../assets/images/logo.png"
        alt="profile-image"
      />
    </div>

    <!-- search -->
    <input type="text" class="form-control form-control-sm" id="search" placeholder="Search.." />

    <!-- settings -->
    <div>
      <router-link :class="{ active: $route.name === 'Settings' }" to="/dashboard/settings">
        <font-awesome-icon class="fs-4" icon="gear" />
      </router-link>
    </div>
  </div>
</template>

<style scoped>
  .text-muted {
    color: #8c8c8c;
  }

  a {
    text-decoration: none;
    color: grey;
  }

  a:hover {
    color: #191919;
  }

  .active {
    text-decoration: none;
    color: #191919;
  }
</style>
