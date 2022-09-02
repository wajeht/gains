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

async function getSearch() {
  try {
    loading.value = true;
    const res = await api.get(`/api/v1/variables/open-powerlifting?q=${searchText.value}`);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    lifters.value = json.data || [];

    loading.value = false;
  } catch (e) {
    loading.value = false;
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
    <div class="my-3 d-flex flex-column gap-3">
      <!-- alert -->
      <div v-if="alert.type" :class="`alert-${alert.type}`" class="mb-0 alert">
        <span>{{ alert.msg }}</span>
      </div>

      <!-- card -->
      <div class="card">
        <div class="card-body">
          <form @submit.prevent="getSearch()">
            <div class="input-group">
              <input type="text" class="form-control" v-model.trim="searchText" required />
              <button class="btn btn-outline-secondary" type="submit">Search</button>
              <button
                class="btn btn-outline-secondary"
                type="reset"
                @click="(lifters = []), (searchText = '')"
              >
                Clear
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
                <tbody>
                  <tr v-for="(lifter, index) in lifters">
                    <td class="align-middle text-center" v-for="(data, j) in lifter">
                      {{ data }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
