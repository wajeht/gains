<script setup>
import { ref, reactive } from 'vue';
import Backheader from '../../../../components/dashboard/headers/Backheader.vue';
import api from '../../../../../../utils/fetch-with-style.js';

const alert = reactive({
  type: '',
  msg: '',
});

const searchText = ref('');
const lifters = ref([]);
const loading = ref(false);
const notFound = ref(false);
const initialPage = ref(true);

async function getSearch() {
  try {
    loading.value = true;
    initialPage.value = false;

    alert.msg = '';
    alert.type = '';

    const res = await api.get(`/api/v1/variables/open-powerlifting?q=${searchText.value}`);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    if (json.data.length === 0) notFound.value = true;
    lifters.value = json.data || [];
    loading.value = false;
  } catch (e) {
    loading.value = false;
    notFound.value = false;
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

  <div class="container px-3 animate__animated animate__fadeIn animate__faster">
    <div class="my-3 d-flex flex-column gap-3" v-auto-animate>
      <!-- alert -->
      <div v-if="alert.type" :class="`alert-${alert.type}`" class="mb-0 alert">
        <span>{{ alert.msg }}</span>
      </div>

      <!-- card -->
      <div class="card">
        <div class="card-body" v-auto-animate>
          <!-- info -->
          <div v-if="initialPage" class="alert alert-info mt-4" :class="{ 'mb-4': initialPage }">
            Search lifters information inside open powerlifting database
          </div>

          <form @submit.prevent="getSearch()" :class="{ 'mb-4': initialPage }">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                v-model.trim="searchText"
                required
                :disabled="loading"
              />

              <button class="btn btn-dark" type="submit" :disabled="loading">
                <div v-if="loading" class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>

                <span v-if="!loading"><i class="bi bi-search"></i></span>
                <span v-if="loading"> Loading...</span>
              </button>
              <button
                v-if="!loading"
                class="btn btn-danger"
                type="reset"
                @click="(lifters = []), (searchText = ''), (notFound = false)"
              >
                <i class="bi bi-x-circle"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- card -->
      <div v-if="lifters.length" class="card">
        <div class="card-body">
          <div class="table-responsive">
            <small>
              <table class="table table-striped table-hover table-sm">
                <thead>
                  <tr>
                    <!-- <th class="text-center">#</th> -->
                    <th class="text-center">Rank</th>
                    <th class="text-center">Lifter</th>
                    <!-- <th class="text-center">Instagram</th> -->
                    <!-- <th class="text-center"></th> -->
                    <!-- <th class="text-center"></th> -->
                    <!-- <th class="text-center"></th> -->
                    <!-- <th class="text-center">Country</th> -->
                    <!-- <th class="text-center">Country State</th>
                    <th class="text-center">Fed</th> -->
                    <th class="text-center">Date</th>
                    <th class="text-center">Country</th>
                    <th class="text-center">State</th>
                    <!-- <th class="text-center">Meet Code</th> -->
                    <th class="text-center">Sex</th>
                    <th class="text-center">Equip</th>
                    <th class="text-center">Age</th>
                    <th class="text-center">Division</th>
                    <th class="text-center">Weight</th>
                    <th class="text-center">Class</th>
                    <th class="text-center">Squat</th>
                    <th class="text-center">Bench</th>
                    <th class="text-center">Deadlift</th>
                    <th class="text-center">Total</th>
                    <th class="text-center">Dots</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="lifter in lifters">
                    <template v-for="(data, j) in lifter">
                      <td
                        v-if="
                          j != 0 && // number
                          j != 3 && // instagram
                          j != 4 &&
                          j != 5 &&
                          j != 6 &&
                          j != 7 &&
                          j != 8 &&
                          j != 9 &&
                          j != 13 // meet code
                        "
                        class="align-middle text-center"
                      >
                        {{ data }}
                      </td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </small>
          </div>
        </div>
      </div>

      <!-- not-found -->
      <div v-if="notFound && !lifters.length" class="card">
        <div class="card-body">
          <div class="table-responsive">
            <small>
              <div class="text-muted text-center fw-light">No relevant data found!</div>
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
