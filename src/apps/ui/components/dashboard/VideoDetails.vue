<template>
  <XyzTransition appear xyz="fade small out-down">
    <div class="my-2">
      <div class="card shadow-sm border">
        <div class="d-flex justify-content-between card-header">
          <div>
            <img
              src="https://github.com/mdo.png"
              alt=""
              width="24"
              height="24"
              class="rounded-circle me-2"
            /><span>yanlon</span>
          </div>
          <div class="dropdown">
            <a
              class="link-dark"
              role="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              ><i class="bi bi-three-dots"></i
            ></a>
            <ul class="dropdown-menu dropdown-menu-end" style="min-width: fit-content">
              <li><button class="dropdown-item btn-sm" type="button">Edit</button></li>
              <li><button class="dropdown-item btn-sm" type="button">Share</button></li>
              <li><button class="dropdown-item btn-sm" type="button">Delete</button></li>
            </ul>
          </div>
        </div>
        <img
          class="card-img-top"
          src="https://dummyimage.com/400x400/bdbdbd/000000.jpg$2text=squat"
          alt=""
        />
        <div class="card-body">
          <h5 class="card-title">squat</h5>
          <p class="card-text">squat sucks today</p>
        </div>
        <div class="card-footer">
          <small class="d-flex justify-content-between text-muted">
            <!-- date -->
            <span><i class="bi bi-calendar-check me-1"></i> 2020-01-01</span>

            <!-- comment -->
            <div class="gap-2">
              <span><i class="bi bi-journal-text me-2"></i></span>
              <span><i class="bi bi-chat me-1"></i><span>2</span></span>
            </div>
          </small>
        </div>
      </div>
    </div>
  </XyzTransition>
</template>

<script>
  export default {
    props: ['id'],
    data() {
      return {
        id: this.$route.params.id,
      };
    },
  };
</script>
