<script setup>
import Backheader from '../../../../components/dashboard/headers/Backheader.vue';
import api from '../../../../../../utils/fetch-with-style.js';
import useAppStore from '../../../../store/app.store';
import useUserStore from '../../../../store/user.store';
import { ref, onMounted, reactive } from 'vue';

const appStore = useAppStore();
const userStore = useUserStore();
const changelogs = ref('');
const alreadySubscribedToChangelog = ref(false);

const subscribeChangelogReleaseLoading = ref(false);
const UnsubscribeChangelogReleaseLoading = ref(false);

const alert = reactive({
  msg: '',
  type: '',
});

onMounted(async () => {
  appStore.loading = true;
  const data = await getChangelogs();
  changelogs.value = data;

  alreadySubscribedToChangelog.value = await checkChangelogSubscription();

  appStore.loading = false;
});

async function checkChangelogSubscription() {
  try {
    const res = await api.get(
      `/api/v1/subscriptions/changelog-subscription?email=${userStore.user.email}`,
    );
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    return json.data.length === 1;
  } catch (e) {
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

async function getChangelogs() {
  try {
    const res = await api.get(`/api/v1/variables/changelogs`);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    return json.changelogs;
  } catch (e) {
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

async function UnsubscribeChangelogRelease() {
  try {
    UnsubscribeChangelogReleaseLoading.value = true;
    const body = {
      email: userStore.user.email,
      user_id: userStore.user.id,
    };

    const res = await api.post(`/api/v1/subscriptions/unsubscribe-changelog`, body);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    alreadySubscribedToChangelog.value = false;
    UnsubscribeChangelogReleaseLoading.value = false;

    return json.data;
  } catch (e) {
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

async function subscribeChangelogRelease() {
  try {
    subscribeChangelogReleaseLoading.value = true;

    const body = {
      email: userStore.user.email,
      user_id: userStore.user.id,
    };

    const res = await api.post(`/api/v1/subscriptions/subscribe-changelog`, body);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    alreadySubscribedToChangelog.value = true;
    subscribeChangelogReleaseLoading.value = false;
    clearDataAndDismissSubscribeChangelogRelease();
  } catch (e) {
    clearDataAndDismissSubscribeChangelogRelease();
    subscribeChangelogReleaseLoading.value = false;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

function clearDataAndDismissSubscribeChangelogRelease() {
  const modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById(`subscribe-changelog-release`),
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
    <!-- alert -->
    <div v-if="alert.type" :class="`alert-${alert.type}`" class="mb-0 alert">
      <span>{{ alert.msg }}</span>
    </div>

    <!-- loop -->
    <div class="my-3 d-flex flex-column gap-3">
      <div class="card">
        <div class="card-body d-flex flex-column justify-content-center text-center">
          <!-- subscribe -->
          <span v-if="!alreadySubscribedToChangelog">
            <p class="card-text">
              Subscribe to receive changelogs whenever we release newer version of Gains!
            </p>
            <button
              data-bs-toggle="modal"
              data-bs-target="#subscribe-changelog-release"
              type="button"
              class="btn btn-success"
              :disabled="alreadySubscribedToChangelog"
            >
              Subscribe
            </button>
          </span>

          <!-- unsubscribe -->
          <span v-else>
            <p class="card-text">Unsubscribe fom getting new changelog mailing list!</p>
            <button
              @click="UnsubscribeChangelogRelease()"
              type="button"
              class="btn btn-danger"
              :disabled="UnsubscribeChangelogReleaseLoading"
            >
              <div
                v-if="UnsubscribeChangelogReleaseLoading"
                class="spinner-border spinner-border-sm"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>
              <span v-if="!UnsubscribeChangelogReleaseLoading">
                <i class="bi bi-x-circle-fill"></i> Unsubscribe
              </span>
              <span v-if="UnsubscribeChangelogReleaseLoading"> Loading... </span>
            </button>
          </span>
        </div>
      </div>

      <!-- change log card -->
      <div v-for="(cl, i) in changelogs" :key="i" class="card">
        <div class="card-body mt-0 pt-2" v-auto-animate>
          <!-- title -->
          <div class="d-flex justify-content-between gap-3 align-items-center">
            <!-- version -->
            <div v-html="cl.version"></div>

            <!-- collapsed/expend -->
            <span
              @click="cl.current = !cl.current"
              class="p-0 m-0"
              style="background: none; border: none; box-shadow: none"
              role="button"
              v-auto-animate
            >
              <i v-if="!cl.current" class="bi bi-chevron-down"></i>
              <i v-if="cl.current" class="bi bi-chevron-up"></i>
            </span>
          </div>

          <!-- changelog -->
          <div v-if="cl.current" v-html="cl.changelog"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- subscribe to changelog release email -->
  <form
    @submit.prevent="subscribeChangelogRelease()"
    class="modal fade px-1 pt-5"
    id="subscribe-changelog-release"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <!-- header -->
        <div class="modal-header">
          <h5 class="modal-title">Subscribe</h5>

          <button
            @click="clearDataAndDismissSubscribeChangelogRelease()"
            type="reset"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            :disabled="subscribeChangelogReleaseLoading"
          ></button>
        </div>

        <!-- body -->
        <div class="modal-body">
          <!-- are you sure -->
          <p class="mb-3 pb-0 text-center">
            Are you sure you want to subscribe changelog release email to the following address?
          </p>

          <input
            :value="userStore.user.email"
            id="email"
            class="form-control form-control-sm"
            type="email"
            required
            disabled
          />
        </div>

        <!-- footer -->
        <div class="modal-footer">
          <!-- cancel -->
          <button
            @click="clearDataAndDismissSubscribeChangelogRelease()"
            v-if="!subscribeChangelogReleaseLoading"
            type="reset"
            class="btn btn-danger"
            data-bs-dismiss="modal"
          >
            <i class="bi bi-x-circle-fill"></i>
            Cancel
          </button>

          <!-- add -->
          <button
            type="submit"
            class="btn btn-success"
            :disabled="subscribeChangelogReleaseLoading"
          >
            <div
              v-if="subscribeChangelogReleaseLoading"
              class="spinner-border spinner-border-sm"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <span v-if="!subscribeChangelogReleaseLoading">
              <i class="bi bi-check-circle-fill"></i> Submit
            </span>
            <span v-if="subscribeChangelogReleaseLoading"> Loading... </span>
          </button>
        </div>
      </div>
    </div>
  </form>
</template>
