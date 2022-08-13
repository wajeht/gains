<script setup>
import { reactive, ref } from 'vue';
import api from '../../../../../../utils/fetch-with-style.js';
import Backheader from '../../../../components/dashboard/headers/Backheader.vue';
import useUserStore from '../../../../store/user.store.js';

const userStore = useUserStore();

const alert = reactive({ type: '', msg: '' }); // prettier-ignore
const deleteAccountLoading = ref(false);
const iAmSure = ref(false);

async function deleteAccount() {
  try {
    deleteAccountLoading.value = true;

    const res = await api.delete(`/api/v1/users/${userStore.user.id}`);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    clearAndDismissDeleteAccountModal();
    deleteAccountLoading.value = false;
    userStore.logout();
  } catch (e) {
    clearAndDismissDeleteAccountModal();
    deleteAccountLoading.value = false;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

function clearAndDismissDeleteAccountModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('delete-account'));
  modal.hide();
}
</script>

<template>
  <!-- header -->
  <Backheader />

  <div class="container px-3 animate__animated animate__fadeIn animate__faster">
    <div class="my-3 d-flex flex-column gap-3">
      <!-- alert -->
      <div v-if="alert.type" :class="`alert-${alert.type}`" class="mb-0 alert">
        <span>{{ alert.msg }}</span>
      </div>

      <!-- card -->
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Delete account</h5>
          <!-- alert -->
          <p class="card-text">
            This will permanently delete your account and all of its data. You will not be able to
            reactivate this account.
          </p>

          <!-- reason -->
          <div class="mb-3">
            <label class="form-label" for="reasons"
              >What is the main reason you are deleting your account?
              <small class="text-muted fst-italic">(optional)</small></label
            >
            <select class="form-select" id="reasons">
              <option selected disabled>Select a reason</option>
              <option value="1">user experience sucks</option>
              <option value="2">i like instagram better</option>
              <option value="3">other reasons</option>
            </select>
          </div>

          <!-- text area -->
          <div class="mb-3">
            <label class="form-label" for="feedback"
              >We are sorry to see you go. Please explain why you are leaving to help us improve
              <small class="text-muted fst-italic">(optional)</small></label
            >
            <textarea class="form-control form-control-sm" id="feedback" rows="5"></textarea>
          </div>

          <!-- checkbox -->
          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" id="sure" v-model="iAmSure" />
            <label class="form-check-label" for="sure"
              >Yes, I want to permanently delete this account and all its data.</label
            >
          </div>

          <!-- button -->
          <button
            data-bs-toggle="modal"
            data-bs-target="#delete-account"
            type="button"
            class="btn btn-danger"
            :disabled="!iAmSure"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- delete modal -->
  <form
    @submit.prevent="deleteAccount()"
    class="modal fade px-2 py-5"
    id="delete-account"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirm</h5>
          <button
            @click="clearAndDismissDeleteAccountModal()"
            type="reset"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            :disabled="deleteAccountLoading"
          ></button>
        </div>
        <div class="modal-body">
          <p class="mb-0 pb-0 text-center">
            Are you sure you want to delete your account? This cannot be undone!
          </p>
        </div>

        <!-- footer -->
        <div class="modal-footer">
          <!-- cancel -->
          <button
            @click="clearAndDismissDeleteAccountModal()"
            v-if="!deleteAccountLoading"
            type="reset"
            class="btn btn-danger"
            data-bs-dismiss="modal"
          >
            <i class="bi bi-x-circle-fill"></i>
            Cancel
          </button>

          <!-- confirm -->
          <button type="submit" class="btn btn-success" :disabled="deleteAccountLoading">
            <div v-if="deleteAccountLoading" class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>

            <span v-if="!deleteAccountLoading"
              ><i class="bi bi-check-circle-fill"></i> Confirm
            </span>
            <span v-if="deleteAccountLoading"> Loading... </span>
          </button>
        </div>
      </div>
    </div>
  </form>
</template>
