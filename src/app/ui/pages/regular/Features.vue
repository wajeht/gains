<script setup>
import { ref } from 'vue';
import { sleep } from '../../../../utils/helpers.js';

const currentFeature = ref(null);
const features = ref([
  {
    id: 1,
    name: 'tracking',
    title: '📈 Data intensive tracking.',
    subtitle: 'It’ll blow your mind.',
    description:
      'We take every piece of data that you give and formulate insightful and accurate graphics. Consider your sleep, diet, workouts and progress at a glance with our aggregation algorithm.',
    poster: new URL('../../assets/images/tracking.png', import.meta.url).href,
    video: new URL('../../assets/videos/tracking.mp4', import.meta.url).href,
  },
  {
    id: 2,
    name: 'instagram',
    title: '📺 Instagram style video layout.',
    subtitle: 'See for yourself.',
    description:
      "Browse other users' content, view popular content, like photos, and follow other users to add their content to a personal feed.",
    poster: new URL('../../assets/images/videos.jpg', import.meta.url).href,
    video: new URL('../../assets/videos/instagram-style.mp4', import.meta.url).href,
  },
  {
    id: 3,
    name: 'calculators',
    title: '🧮 A bunch of calculators.',
    subtitle: 'It’ll blow your mind.',
    description:
      "Anxious to know where you're at? Find one of our many calculators and give it a whirl.",
    poster: new URL('../../assets/images/calculators.png', import.meta.url).href,
    video: new URL('../../assets/videos/calculators.mp4', import.meta.url).href,
  },
  {
    id: 4,
    name: 'charts',
    title: '📊 Charts, Graphs, and Reports.',
    subtitle: 'See for yourself.',
    description:
      'Chart tools are powerful, simple to use, and free. Try out our rich gallery of interactive charts and data tools.',
    poster: new URL('../../assets/images/charts-and-graph.png', import.meta.url).href,
    video: new URL('../../assets/videos/chart.mp4', import.meta.url).href,
  },
]);

async function previewVideo(index) {
  currentFeature.value = features.value[index];

  await sleep(5);

  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('preview-video'));
  modal.show();
}

function clearAndDismissPreviewVideoModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('preview-video'));
  modal.hide();
  currentFeature.value = null;
}
</script>

<template>
  <div class="px-4 mx-auto animate__animated animate__fadeIn">
    <!-- features -->
    <section
      v-for="(f, index) in features"
      class="pb-5 border-bottom"
      :key="f.id"
      :class="{ 'pt-5': index != 0 }"
      v-once
    >
      <div class="row">
        <!-- left -->
        <div class="col-md-5">
          <div role="button" @click="previewVideo(index)" class="poster-container">
            <img :src="f.poster" style="width: 100%" class="border border-1" rel="preload" />
            <div class="middle">
              <i class="bi bi-play-circle-fill" style="font-size: 80px; color: black"></i>
            </div>
          </div>
        </div>

        <!-- right -->
        <div class="col-md-7">
          <h2 class="featurette-heading pt-md-3">
            {{ f.title }} <span class="text-muted">{{ f.subtitle }}</span>
          </h2>
          <p class="lead">
            {{ f.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- github -->
    <section id="github" class="py-5 text-center">
      <!-- title -->
      <h2 class="featurette-heading">
        👨‍💻 Are you a developer? <span class="text-muted">That's cool..!</span>
      </h2>

      <!-- description -->
      <p class="lead py-3">
        Help us bring new ideas to life by contributing to our long term project. Or if you have
        specific idea that will help many lifters, feel free to get involve with our development
        process!
      </p>

      <!-- button -->
      <div class="d-flex justify-content-center gap-2">
        <!-- contribute -->
        <a class="btn btn-success" href="https://github.com/wajeht/gains" target="_blank">
          <i class="bi bi-github me-1"></i>
          Contribute
        </a>

        <!-- request feature -->
        <a
          class="btn btn-dark"
          href="https://github.com/wajeht/gains/issues/new/choose"
          target="_blank"
        >
          <i class="bi bi-plus-circle-fill me-1"></i>
          Request features
        </a>
      </div>
    </section>
  </div>

  <!-- preview a video modal -->
  <div
    v-if="currentFeature != null"
    class="modal fade px-2 py-5"
    id="preview-video"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <!-- header -->
        <div class="modal-header">
          <h5 class="modal-title">Preview video</h5>
          <button
            @click="clearAndDismissPreviewVideoModal()"
            type="reset"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <!-- body -->
        <div class="modal-body">
          <video class="video" controls playsinline autoplay muted>
            <source :src="currentFeature.video" type="video/mp4" />
          </video>
        </div>

        <!-- footer -->
        <div class="modal-footer">
          <!-- cancel -->
          <button
            @click="clearAndDismissPreviewVideoModal()"
            type="reset"
            class="btn btn-dark w-100"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  h2 {
    padding-top: 20px;
  }
}
.video {
  height: 100%;
  width: 100%;
  object-fit: contain;
  background-color: black;
}

.poster-container {
  position: relative;
  aspect-ratio: 1/1;
  border-radius: 4px;
  width: auto;
  height: auto;
  overflow: hidden;
}

.image {
  opacity: 1;
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: 0.5s ease;
  backface-visibility: hidden;
}

.middle {
  transition: 0.5s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}

.poster-container:hover {
  transition: 0.5s ease;
  -webkit-filter: brightness(75%);
  filter: brightness(75%);
}

.poster-container:hover .image {
  opacity: 1;
}

.poster-container:hover .middle {
  opacity: 1;
}

video::-webkit-media-controls {
  visibility: hidden;
}

video::-webkit-media-controls-enclosure {
  visibility: visible;
}
</style>
