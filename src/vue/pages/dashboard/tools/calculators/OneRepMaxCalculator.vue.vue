<script setup>
import Backheader from '../../../../components/dashboard/headers/Backheader.vue';
import { calculateE1RM } from '../../../../../../utils/helpers.js';
import useAppStore from '../../../../store/app.store.js';

const appStore = useAppStore();

import { ref } from 'vue';

const reps = ref(null);
const rpe = ref(null);
const weight = ref(null);
const e1RM = ref(null);

function calculate() {
  e1RM.value = calculateE1RM(weight.value, rpe.value, reps.value);
}
</script>

<template>
  <!-- header -->
  <Backheader />

  <div class="container px-3 animate__animated animate__fadeIn animate__faster">
    <div class="my-3 d-flex flex-column gap-3">
      <!-- card -->
      <div>
        <h5><i class="bi bi-calculator me-1"></i>One Rep Max Calculator</h5>
        <div class="card">
          <div class="card-body">
            <div class="py-5">
              <h1 v-if="e1RM" class="card-title text-center m-0 p-0">
                {{ e1RM }} {{ appStore.unitLabel }}
              </h1>
              <h1 v-else class="card-title text-center m-0 p-0">[ e1RM ]</h1>
            </div>

            <form @submit.prevent="calculate()">
              <!-- reps -->
              <div class="mb-3">
                <label for="reps" class="form-label">Reps*</label>
                <input
                  v-model="reps"
                  :placeholder="reps"
                  step="1"
                  min="1"
                  max="24"
                  type="number"
                  inputmode="numeric"
                  pattern="[1-24]*"
                  class="form-control"
                  id="reps"
                  required
                />
              </div>

              <!-- weight -->
              <div class="mb-3">
                <label for="number" class="form-label">Weight*</label>
                <input
                  v-model="weight"
                  :placeholder="weight"
                  step="1"
                  min="1"
                  max="1000"
                  type="number"
                  inputmode="numeric"
                  pattern="[1-1000]*"
                  class="form-control"
                  id="weight"
                  required
                />
              </div>

              <!-- rpe -->
              <div class="mb-5">
                <label for="rpe" class="form-label"
                  >Rpe <span class="text-muted fw-light">(Optional)</span></label
                >
                <input
                  v-model="rpe"
                  :placeholder="rpe"
                  step=".5"
                  min="1"
                  max="10"
                  type="number"
                  inputmode="numeric"
                  pattern="[1-10]*"
                  class="form-control"
                  id="rpe"
                />
              </div>

              <!-- button -->
              <button
                type="submit"
                class="btn btn-dark d-block mx-auto my-4"
                :disabled="!reps || !weight"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
