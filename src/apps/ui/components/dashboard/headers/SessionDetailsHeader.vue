<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { capitalizeAWord } from '../../../../../utils/helpers.js';

const router = useRouter();
const previousPageName = ref('');
const updateCurrentSessionLoading = ref(null);

onMounted(() => {
  let back = router.options.history.state.back.split('/');
  back = back[back.length - 1];
  previousPageName.value = capitalizeAWord(back);
});

// this code below required for back drop problem fixed when adding a new session header model
onMounted(() => document.body.appendChild(document.getElementById(`update-current-session`)));
onUnmounted(() => document.body.removeChild(document.getElementById(`update-current-session`)));
// this code above required for back drop problem fixed when adding a new session header model

async function updateCurrentSession() {
  console.log('updateCurrentSession()');
}

function clearAndDismissUpdateCurrentSessionModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById('update-current-session'),
  );
  modal.hide();
}
</script>

<template>
  <div
    style="height: 64px"
    class="container sticky-top d-flex justify-content-between align-items-center bg-white border-bottom py-3 gap-3"
  >
    <!-- back -->
    <span role="button" @click="$router.back()" class="link-secondary">
      <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
        <font-awesome-icon icon="angle-left" class="p-0 m-0" />
        {{ previousPageName }}
      </h5>
    </span>

    <!-- middle -->
    <!-- <input type="text" class="form-control form-control-sm" id="search" placeholder="Search.." /> -->

    <!-- Edit -->
    <!-- <button class="btn btn-outline-dark">
      <i class="bi bi-pencil-square"></i>
      Edit
    </button> -->

    <div class="dropdown">
      <!-- setting icons -->
      <a
        class="link-dark"
        role="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
          <!-- <i class="bi bi-three-dots-vertical"> </i> -->
          <font-awesome-icon icon="bars" />
        </h5>
      </a>

      <!-- setting links -->
      <ul class="dropdown-menu dropdown-menu-end shadow-sm" style="min-width: fit-content">
        <li>
          <button
            class="dropdown-item btn-sm"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#update-current-session"
          >
            Edit
          </button>
        </li>
        <li><button class="dropdown-item btn-sm" type="button">Delete</button></li>
      </ul>
    </div>

    <!-- modal -->
    <form
      @submit.prevent="updateCurrentSession()"
      class="modal fade px-2 py-5"
      id="update-current-session"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <span> Update </span>
            </h5>
            <button
              @click="clearAndDismissUpdateCurrentSessionModal()"
              type="reset"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <!-- input -->
            <div class="mb-3"></div>

            <!-- input -->
            <div class="mb-3"></div>
          </div>

          <!-- footer -->
          <div class="modal-footer">
            <!-- cancel -->
            <button
              @click="clearAndDismissUpdateCurrentSessionModal()"
              v-if="!updateCurrentSessionLoading"
              type="reset"
              class="btn btn-danger"
              data-bs-dismiss="modal"
            >
              <i class="bi bi-x-circle"></i>
              Cancel
            </button>

            <!-- add -->
            <button type="submit" class="btn btn-success" :disabled="updateCurrentSessionLoading">
              <div
                v-if="updateCurrentSessionLoading"
                class="spinner-border spinner-border-sm"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>
              <span v-if="!updateCurrentSessionLoading">
                <i class="bi bi-check-circle-fill"></i>
                Submit
              </span>
              <span v-if="updateCurrentSessionLoading"> Loading... </span>
            </button>
          </div>
        </div>
      </div>
    </form>
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
