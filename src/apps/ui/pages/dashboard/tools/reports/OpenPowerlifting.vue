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

      <!-- info -->
      <div v-if="initialPage" class="alert alert-info mb-0">
        Search lifters information inside open powerlifting database
      </div>

      <!-- card -->
      <div class="card">
        <div class="card-body" v-auto-animate>
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
                    <th v-for="(h, i) in Object.keys(lifters[0])" :key="i" class="text-center">
                      {{ h }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(lifter, i) in lifters" :key="i">
                    <template v-for="(data, j) in lifter" :key="j">
                      <td class="align-middle text-center">
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
