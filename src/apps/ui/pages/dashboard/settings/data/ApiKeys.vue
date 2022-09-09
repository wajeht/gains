<script setup>
import { reactive, ref, onMounted } from 'vue';
import api from '../../../../../../utils/fetch-with-style.js';
import Backheader from '../../../../components/dashboard/headers/Backheader.vue';
import useAppStore from '../../../../store/app.store';
import useUserStore from '../../../../store/user.store.js';
import { sleep } from '../../../../../../utils/helpers.js';

const appStore = useAppStore();
const userStore = useUserStore();

const alert = reactive({ type: '', msg: '' }); // prettier-ignore
const deleteApiKeyLoading = ref(false);
const deleteApiKeySelectedId = ref(null);
const copyApiKeySelectedIndex = ref(null);
const copyApiKeySelectedIcon = ref(null);
const requestApiKeyLoading = ref(false);
const deleteApiKeySelectedIndex = ref(false);
const apiKeys = ref([]);

onMounted(async () => {
  appStore.loading = true;
  const x = await getApiKeys();
  apiKeys.value = x;
  appStore.loading = false;
});

async function getApiKeys() {
  try {
    const res = await api.get(`/api/v1/api-keys/user/${userStore.user.id}`);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    return json.data;
  } catch (e) {
    appStore.loading = false;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

async function requestApiKey() {
  try {
    requestApiKeyLoading.value = true;

    const wait = await sleep(1000); // wait a while before generating new keys because of db error

    const res = await api.post(`/api/v1/api-keys/`, { user_id: userStore.user.id });
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    requestApiKeyLoading.value = false;
    apiKeys.value.push(json.data[0]);
  } catch (e) {
    requestApiKeyLoading.value = false;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

async function copyApiKey(index) {
  appStore.showToast(`Copied!`);
  copyApiKeySelectedIcon.value = true;
  let textarea = document.createElement('textarea');
  textarea.textContent = apiKeys.value[index]?.key;
  document.body.appendChild(textarea);
  const selection = document.getSelection();
  const range = document.createRange();
  range.selectNode(textarea);
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand('copy');
  selection.removeAllRanges();
  document.body.removeChild(textarea);
  setTimeout(() => {
    copyApiKeySelectedIcon.value = false;
  }, 400);
}

async function deleteApiKey() {
  try {
    deleteApiKeyLoading.value = true;

    const res = await api.delete(`/api/v1/api-keys/${deleteApiKeySelectedId.value}`);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    clearAndDismissDeleteApiKeyModal();
    deleteApiKeyLoading.value = false;

    apiKeys.value = apiKeys.value.filter((cur, idx) => idx != deleteApiKeySelectedIndex.value);
  } catch (e) {
    clearAndDismissDeleteApiKeyModal();
    deleteApiKeyLoading.value = false;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

function clearAndDismissDeleteApiKeyModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById('delete-api-key-modal'),
  );
  modal.hide();
}
</script>

<template>
  <!-- header -->
  <Backheader />

  <div
    v-if="!appStore.loading"
    class="container px-3 animate__animated animate__fadeIn animate__faster"
  >
    <div class="my-3 d-flex flex-column gap-3" v-auto-animate>
      <!-- alert -->
      <div v-if="alert.type" :class="`alert-${alert.type}`" class="mb-0 alert">
        <span>{{ alert.msg }}</span>
      </div>

      <!-- card -->
      <div>
        <!-- title -->
        <h5><i class="bi bi-key-fill"></i> Api keys</h5>
        <div class="list-group">
          <div class="card">
            <div class="card-body">
              <p class="card-text">
                API keys allow you to integrate gains with other websites, services, and data
                sources. You can use them with our existing integrations, or you can build one
                yourself.
              </p>

              <!-- apis -->
              <span v-if="apiKeys.length" v-auto-animate>
                <div v-for="(key, index) in apiKeys" :key="key.id" class="input-group mb-3">
                  <input
                    type="text"
                    class="form-control"
                    :value="key.key"
                    :id="key.key"
                    readonly="readonly"
                  />
                  <button
                    @click="(copyApiKeySelectedIndex = index), copyApiKey(index)"
                    class="btn btn-outline-secondary"
                    type="button"
                  >
                    <span v-if="copyApiKeySelectedIcon && index == copyApiKeySelectedIndex">
                      <!-- <i class="bi bi-clipboard2"></i> -->
                      <i class="bi bi-check2"></i>
                    </span>
                    <span v-else>
                      <i class="bi bi-clipboard2-check"></i>
                    </span>
                  </button>
                  <button
                    @click="(deleteApiKeySelectedId = key.id), (deleteApiKeySelectedIndex = index)"
                    data-bs-toggle="modal"
                    data-bs-target="#delete-api-key-modal"
                    class="btn btn-outline-danger"
                    type="button"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </span>

              <!-- empty -->
              <p v-else class="card-text alert alert-warning">
                You currently do not have any api keys. Request for a key!
              </p>

              <!-- button -->
              <button
                @click="requestApiKey()"
                type="button"
                class="btn btn-primary"
                :disabled="requestApiKeyLoading"
              >
                <div
                  v-if="requestApiKeyLoading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                >
                  <span class="visually-hidden">Requesting...</span>
                </div>

                <span v-if="!requestApiKeyLoading"> Request </span>
                <span v-if="requestApiKeyLoading"> Requesting... </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- modal -->
  <form
    @submit.prevent="deleteApiKey()"
    class="modal fade px-2 py-5"
    id="delete-api-key-modal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <!-- header -->
        <div class="modal-header">
          <h5 class="modal-title">
            Delete:
            <span class="fw-light"> id {{ apiKeys[deleteApiKeySelectedIndex]?.id }}</span>
          </h5>
          <button
            @click="clearAndDismissDeleteApiKeyModal()"
            type="reset"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            :disabled="deleteApiKeyLoading"
          ></button>
        </div>

        <!-- body -->
        <div class="modal-body">
          <p class="mb-0 pb-0 text-center">
            Are you sure you want to delete this api key ? This cannot be undone!
          </p>
        </div>

        <!-- footer -->
        <div class="modal-footer">
          <!-- cancel -->
          <button
            @click="clearAndDismissDeleteApiKeyModal()"
            v-if="!deleteApiKeyLoading"
            type="reset"
            class="btn btn-danger"
            data-bs-dismiss="modal"
          >
            <i class="bi bi-x-circle-fill"></i>
            Cancel
          </button>

          <!-- confirm -->
          <button type="submit" class="btn btn-success" :disabled="deleteApiKeyLoading">
            <div v-if="deleteApiKeyLoading" class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>

            <span v-if="!deleteApiKeyLoading"
              ><i class="bi bi-check-circle-fill"></i> Confirm
            </span>
            <span v-if="deleteApiKeyLoading"> Loading... </span>
          </button>
        </div>
      </div>
    </div>
  </form>
</template>
