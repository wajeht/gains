<script setup>
import { onMounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../../utils/fetch-with-style.js';
import Backheader from './headers/Backheader.vue';
import useAppStore from '../../store/app.store.js';
import useUserStore from '../../store/user.store.js';

const appStore = useAppStore();
const userStore = useUserStore();
const router = useRouter();

const props = defineProps({
  id: String,
});

const currentSessionDetails = reactive({});

const currentLogStep = ref(0);

onMounted(async () => {
  const s = await getCurrentSessionDetails();
  Object.assign(currentSessionDetails, s);
  currentSessionDetails.logs = s.logs || [];
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
</script>

<template>
  <!-- header -->
  <Backheader />

  <!-- video details -->
  <XyzTransition appear xyz="fade small out-down">
    <div class="container px-3">
      <div class="my-3 d-flex flex-column gap-3">
        <!-- video -->
        <div class="card shadow-sm border">
          <div class="d-flex justify-content-between card-header">
            <div>
              <img
                :src="
                  userStore.user.profile_picture_url ??
                  `https://dummyimage.com/200x200/bdbdbd/000000.jpg`
                "
                width="24"
                height="24"
                class="rounded-circle me-2"
              />
              <span>{{ userStore.user.username }}</span>
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

          <span v-for="(log, index) in currentSessionDetails.logs">
            <!-- log -->
            <span v-if="currentLogStep === index">
              <!-- video -->
              <div v-if="log?.videos?.length" class="card card-body p-0 m-0 border-0">
                <video preload="none" :poster="log?.videos[0].screenshot_url" controls playsinline>
                  <source :src="log?.videos[0].video_url" type="video/mp4" />
                </video>
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
                  <span class="pt-2 d-flex flex-column">
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

          <div class="card-footer">
            <small class="d-flex justify-content-between text-muted">
              <!-- left -->
              <span class="d-flex gap-3">
                <!-- block -->
                <span v-if="currentSessionDetails.block_name">
                  <i class="bi bi-clipboard2-data me-1"></i>Block:
                  <span class="fw-light">{{ currentSessionDetails.block_name }}</span>
                </span>

                <!-- date -->
                <span><i class="bi bi-calendar-check me-1"></i> 2020-01-01</span>
              </span>

              <!-- right -->
              <div class="d-flex gap-2">
                <!-- session -->
                <span
                  role="button"
                  @click="router.push(`/dashboard/sessions/${currentSessionDetails.id}`)"
                  ><i class="bi bi-journal-text me-1"> </i>
                  <span>
                    {{ currentSessionDetails.id }}
                  </span>
                </span>

                <!-- comment -->
                <span><i class="bi bi-chat me-1"></i><span>2</span></span>
              </div>
            </small>
          </div>
        </div>
      </div>
    </div>
  </XyzTransition>
</template>
