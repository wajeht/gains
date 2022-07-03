<template>
  <XyzTransition appear xyz="fade small out-down">
    <div class="container d-flex flex-column">
      <!-- rpe -->
      <div>
        <input type="text" v-model="rpe" />
        <label for="">RPE</label>
      </div>

      <!-- weight -->
      <div>
        <input type="text" v-model="weight" />
        <label for="">Weight</label>
      </div>

      <!-- rpe -->
      <div>
        <input type="text" v-model="reps" />
        <label for="">Reps</label>
      </div>

      <!-- text -->
      <p>{{ text }}</p>

      <!-- button -->
      <button @click="calculate">Calculate</button>
    </div>
  </XyzTransition>
</template>

<script>
export default {
  data() {
    return {
      rpe: 0,
      weight: 0,
      reps: 0,
      text: '',
    };
  },
  methods: {
    calculate() {
      var RPEIntensity = {
        10: {
          10: 0.74,
          9: 0.76,
          8: 0.79,
          7: 0.81,
          6: 0.84,
          5: 0.86,
          4: 0.89,
          3: 0.92,
          2: 0.96,
          1: 1,
        },
        9.5: {
          10: 0.72,
          9: 0.75,
          8: 0.77,
          7: 0.8,
          6: 0.82,
          5: 0.85,
          4: 0.88,
          3: 0.91,
          2: 0.94,
          1: 0.98,
        },
        9: {
          10: 0.71,
          9: 0.74,
          8: 0.76,
          7: 0.79,
          6: 0.81,
          5: 0.84,
          4: 0.86,
          3: 0.89,
          2: 0.92,
          1: 0.96,
        },
        8.5: {
          10: 0.69,
          9: 0.72,
          8: 0.75,
          7: 0.77,
          6: 0.8,
          5: 0.82,
          4: 0.85,
          3: 0.88,
          2: 0.91,
          1: 0.94,
        },
        8: {
          10: 0.68,
          9: 0.71,
          8: 0.74,
          7: 0.76,
          6: 0.79,
          5: 0.81,
          4: 0.84,
          3: 0.86,
          2: 0.89,
          1: 0.92,
        },
        7.5: {
          10: 0.67,
          9: 0.69,
          8: 0.72,
          7: 0.75,
          6: 0.77,
          5: 0.8,
          4: 0.82,
          3: 0.85,
          2: 0.88,
          1: 0.91,
        },
        7: {
          10: 0.65,
          9: 0.68,
          8: 0.71,
          7: 0.74,
          6: 0.76,
          5: 0.79,
          4: 0.81,
          3: 0.84,
          2: 0.86,
          1: 0.89,
        },
        6.5: {
          10: 0.64,
          9: 0.67,
          8: 0.69,
          7: 0.72,
          6: 0.75,
          5: 0.77,
          4: 0.8,
          3: 0.82,
          2: 0.85,
          1: 0.88,
        },
      };
      // get squat value
      var value = this.weight / RPEIntensity[this.rpe][this.reps];

      const result = Math.round(value, 10);
      this.text = result;
    },
  },
};
</script>
