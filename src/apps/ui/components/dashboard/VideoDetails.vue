<script setup>
import { onMounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../../utils/fetch-with-style.js';
import Backheader from './headers/Backheader.vue';
import useAppStore from '../../store/app.store.js';
import useUserStore from '../../store/user.store.js';
import dayjs from 'dayjs';

const appStore = useAppStore();
const userStore = useUserStore();
const router = useRouter();

const props = defineProps({
  id: String,
});

const alert = reactive({
  type: '',
  msg: '',
});

const currentSessionDetails = reactive({});
const currentLogStep = ref(0);
const comment = ref('');
const comments = ref([]);
const postACommentLoading = ref(false);
const deleteACommentSelectedId = ref(-1);
const deleteACommentSelectedIndex = ref(-1);
const deleteACommentLoading = ref(false);

onMounted(async () => {
  appStore.loading = true;

  // sessions
  const s = await getCurrentSessionDetails();
  Object.assign(currentSessionDetails, s);
  currentSessionDetails.logs = s.logs.filter((x) => x.videos.length) || []; // only disable post with videos

  // comments
  const c = await fetchComments();
  comments.value = c || [];
  appStore.loading = false;
});

async function getCurrentSessionDetails() {
  try {
    const res = await api.get(`/api/v1/sessions/${props.id}`);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    const [result] = json.data;

    return result;
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

async function deleteAComment() {
  try {
    deleteACommentLoading.value = true;

    const res = await api.delete(`/api/v1/comments/${deleteACommentSelectedId.value}`);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    clearAndDismissDeleteACommentModal();
    deleteACommentLoading.value = false;

    comments.value = comments.value.filter(
      (cur, index) => index != deleteACommentSelectedIndex.value,
    );
  } catch (e) {
    clearAndDismissDeleteACommentModal();
    deleteACommentLoading.value = false;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

function clearAndDismissDeleteACommentModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('delete-a-comment'));
  modal.hide();
  deleteACommentLoading.value = false;
}

async function fetchComments() {
  try {
    const res = await api.get(`/api/v1/comments/sessions/${currentSessionDetails.id}`);
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
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

async function postAComment() {
  try {
    postACommentLoading.value = true;

    const body = {
      user_id: userStore.user.id,
      session_id: currentSessionDetails.id,
      comment: comment.value,
    };

    const res = await api.post(`/api/v1/comments`, body);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    postACommentLoading.value = false;

    json.data[0].username = userStore.user.username;
    comments.value.push(json.data[0]);
    comment.value = '';
  } catch (e) {
    postACommentLoading.value = false;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}
</script>

<template>
  <!-- header -->
  <Backheader />

  <!-- video details -->
  <div v-if="!appStore.loading" class="animate__animated animate__fadeIn animate__faster">
    <div class="container px-3">
      <div class="my-3 d-flex flex-column gap-3">
        <!-- alert -->
        <div v-if="alert.type" :class="`alert-${alert.type}`" class="mb-0 alert">
          <span>{{ alert.msg }}</span>
        </div>

        <!-- video -->
        <div class="card shadow-sm border">
          <!-- title -->
          <div class="d-flex justify-content-between card-header">
            <!-- right -->
            <div>
              <img
                :src="
                  currentSessionDetails.profile_picture_url ??
                  `https://dummyimage.com/200x200/bdbdbd/000000.jpg`
                "
                width="24"
                height="24"
                class="rounded-circle me-2"
              />
              <span>{{ currentSessionDetails.username }}</span>
            </div>

            <!-- left -->
            <div class="d-flex justify-content-between gap-3">
              <!-- session name -->
              <span>
                <router-link
                  v-if="userStore.user.id == currentSessionDetails.user_id"
                  :to="`/dashboard/sessions/${currentSessionDetails.id}`"
                  class="link-dark text-decoration-none"
                  >{{ currentSessionDetails.name }}</router-link
                >
                <span v-else>
                  {{ currentSessionDetails.name }}
                </span>
              </span>
            </div>
          </div>

          <!-- body -->
          <span
            v-for="(log, index) in currentSessionDetails.logs"
            :key="`key-video-details${log.id}`"
          >
            <!-- log -->
            <span v-if="currentLogStep === index">
              <!-- video -->
              <div v-if="log?.videos?.length" class="card card-body p-0 m-0 border-0">
                <div class="video-wrapper">
                  <video
                    class="video"
                    preload="none"
                    :poster="log?.videos[0].screenshot_url"
                    controls
                    playsinline
                    muted
                  >
                    <source :src="`/api/v1/videos/${log?.videos[0].id}/stream`" type="video/mp4" />
                  </video>
                </div>
              </div>

              <!-- dots -->
              <div
                v-if="currentSessionDetails.logs?.length > 1"
                class="d-flex gap-2 justify-content-center m-0 p-0"
              >
                <div
                  role="button"
                  @click="currentLogStep = i"
                  v-for="(l, i) in currentSessionDetails.logs"
                  :key="`key-dot-${l.id}`"
                >
                  <i
                    class="bi m-0 p-0"
                    :class="{
                      'bi-circle-fill': currentLogStep === i,
                      'bi-circle': currentLogStep !== i,
                    }"
                    style="font-size: 0.6rem"
                  ></i>
                </div>
              </div>

              <!-- body -->
              <div class="card-body">
                <h5 class="card-title">{{ log.name }}</h5>
                <p class="card-text">
                  <!-- notes -->
                  <span>
                    {{ log.notes }}
                  </span>

                  <!-- sets -->
                  <span
                    class="d-flex flex-column"
                    :class="{ 'pt-0': !log.notes, 'pt-2': log.notes }"
                  >
                    <small v-for="set in log.sets" :key="`key-set-${set.id}`">
                      1 set(s) x {{ set.reps }} rep(s) x {{ set.weight }}
                      {{ appStore.unitLabel }} @{{ set.rpe }} rpe
                      {{ set.notes ? `- ${set.notes}` : '' }}
                    </small>
                  </span>
                </p>
              </div>
            </span>
          </span>

          <!-- footer -->
          <div class="card-footer">
            <span class="d-flex justify-content-between text-muted">
              <!-- left -->
              <span class="d-flex align-items-center gap-2">
                <!-- date -->
                <small
                  ><i class="bi bi-calendar-check me-1"></i
                  >{{ dayjs(currentSessionDetails.created_at).format('YYYY/MM/DD') }}</small
                >

                <!-- block -->
                <small v-if="currentSessionDetails.block_name">
                  <router-link
                    :to="`/dashboard/blocks/${currentSessionDetails.block_id}`"
                    class="link-secondary text-decoration-none"
                  >
                    <i class="bi bi-journal-text me-1"></i>{{ currentSessionDetails.block_name }}
                  </router-link>
                </small>
              </span>

              <!-- right -->
              <div class="d-flex align-items-center gap-2">
                <!-- session -->
                <small>
                  <router-link
                    v-if="userStore.user.id === currentSessionDetails.user_id"
                    class="link-secondary text-decoration-none"
                    :to="`/dashboard/sessions/${currentSessionDetails.id}`"
                    ><i class="bi bi-journal-text"></i>
                    {{ currentSessionDetails.id }}
                  </router-link>
                </small>

                <!-- comment -->
                <small><i class="bi bi-chat me-1"></i>{{ comments.length || 0 }}</small>
              </div>
            </span>
          </div>
        </div>

        <!-- comments -->
        <div v-if="comments.length" class="d-flex flex-column gap-3" v-auto-animate>
          <div
            v-for="(comment, index) in comments"
            :key="`comment-key-${comment.id}`"
            class="card shadow-sm border"
          >
            <div class="card-body">
              <!-- title -->
              <span class="d-flex justify-content-between align-items-center mb-1">
                <!-- left -->
                <span class="d-flex justify-content-between align-items-center gap-1">
                  <h5 class="card-title m-0 p-0">{{ comment.username }}</h5>

                  <small v-if="userStore.user.id === comment.user_id">
                    <i class="bi bi-check-circle-fill text-primary"></i>
                  </small>
                </span>

                <!-- right -->
                <small class="text-muted d-flex justify-content-between gap-2">
                  <!-- calendar -->
                  <span
                    ><i class="bi bi-calendar-check me-1"></i>
                    {{ dayjs(comment.created_at).format('YYYY/DD/MM') }}</span
                  >

                  <!-- trash -->
                  <span
                    v-if="userStore.user.id === comment.user_id"
                    @click="
                      (deleteACommentSelectedId = comment.id), (deleteACommentSelectedIndex = index)
                    "
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#delete-a-comment"
                    ><i class="bi bi-trash"></i>
                  </span>
                </small>
              </span>

              <!-- comment -->
              <small class="card-text">
                {{ comment.comment }}
              </small>
            </div>
          </div>
        </div>

        <!-- post a comment -->
        <div class="card shadow-sm border">
          <div class="card-body">
            <form @submit.prevent="postAComment()">
              <!-- textarea -->
              <textarea
                v-model="comment"
                class="form-control mb-3"
                name="comment"
                id="comment"
                rows="3"
              ></textarea>

              <!-- button -->
              <button
                type="submit"
                class="btn btn-dark"
                :disabled="postACommentLoading || !comment.length"
              >
                <div
                  v-if="postACommentLoading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
                <span v-if="!postACommentLoading"> Submit </span>
                <span v-if="postACommentLoading"> Loading... </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- delete a comment modal -->
  <form
    @submit.prevent="deleteAComment()"
    class="modal fade px-2 py-5"
    id="delete-a-comment"
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
            <span class="fw-light"> id {{ deleteACommentSelectedId }}</span>
          </h5>
          <button
            @click="clearAndDismissDeleteACommentModal()"
            type="reset"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            :disabled="deleteACommentLoading"
          ></button>
        </div>

        <!-- body -->
        <div class="modal-body">
          <p class="mb-0 pb-0 text-center">
            Are you sure you want to delete this comment ? This cannot be undone!
          </p>
        </div>

        <!-- footer -->
        <div class="modal-footer">
          <!-- cancel -->
          <button
            @click="clearAndDismissDeleteACommentModal()"
            v-if="!deleteACommentLoading"
            type="reset"
            class="btn btn-danger"
            data-bs-dismiss="modal"
          >
            <i class="bi bi-x-circle-fill"></i>
            Cancel
          </button>

          <!-- confirm -->
          <button type="submit" class="btn btn-success" :disabled="deleteACommentLoading">
            <div
              v-if="deleteACommentLoading"
              class="spinner-border spinner-border-sm"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>

            <span v-if="!deleteACommentLoading"
              ><i class="bi bi-check-circle-fill"></i> Confirm
            </span>
            <span v-if="deleteACommentLoading"> Loading... </span>
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
.video-wrapper {
  aspect-ratio: 1/1;
  width: auto;
  height: auto;
  overflow: hidden;
}

.video {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

video::-webkit-media-controls {
  visibility: hidden;
}

video::-webkit-media-controls-enclosure {
  visibility: visible;
}
</style>
