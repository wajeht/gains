<template>
  <div class="container">
    <div class="my-3 d-flex flex-column gap-4" data-aos="fade-up">
      <!-- profile -->
      <div>
        <h5><i class="bi bi-person-fill"></i> Profile</h5>
        <div class="card card-body">
          <img
            class="rounded-circle img-fluid"
            width="200"
            height="200"
            src="https://dummyimage.com/200x200/bdbdbd/000000.jpg"
          />

          <ul>
            <li>recent time max</li>
            <li>all time max</li>
            <li>recovery stuff</li>
            <li>avg sleep</li>
            <li>readiness</li>
            <li>soreness</li>
            <li>confidence</li>
            <li>sleep quty</li>
          </ul>

          <!-- logout -->
          <button @click="logout()" class="btn btn-danger w-100" :disabled="loading">
            <div v-if="loading" class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>

            <span v-if="!loading"> Logout </span>
            <span v-if="loading"> Loading... </span>
          </button>
        </div>
      </div>

      <!-- recovery chart -->
      <div>
        <h5><i class="bi bi-activity"></i> Recovery</h5>
        <div class="card" style="height: 100%">
          <div class="card-body">
            <canvas id="myChart"></canvas>
          </div>
        </div>
      </div>

      <!-- recent prs chart -->
      <div>
        <h5><i class="bi bi-graph-up-arrow"></i> Recent PRS</h5>
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped table-hover table-sm p-0 m-0">
                <thead>
                  <tr>
                    <th class="text-center" scope="col">Date</th>
                    <th class="text-start" scope="col">Lift</th>
                    <th class="text-center" scope="col">Weight</th>
                    <th class="text-center" scope="col">Gain</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-center">2022/01/23</td>
                    <td class="text-start">sumo deadlift</td>
                    <td class="text-center">234</td>
                    <td class="text-center text-success">+50</td>
                  </tr>

                  <tr>
                    <td class="text-center">2022/04/11</td>
                    <td class="text-start">conventional deadlift</td>
                    <td class="text-center">234</td>
                    <td class="text-center text-success">+15</td>
                  </tr>
                  <tr>
                    <td class="text-center">2022/08/01</td>
                    <td class="text-start">block pull</td>
                    <td class="text-center">234</td>
                    <td class="text-center text-success">+44</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- bodyweight -->
      <div>
        <h5><i class="bi bi-table"></i> Bodyweight</h5>
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped table-hover table-sm p-0 m-0">
                <thead>
                  <tr>
                    <th class="text-center">Date</th>
                    <th class="text-center">Weight</th>
                    <th class="text-center">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-center">2021/11/03</td>
                    <td class="text-center">185</td>
                    <td class="text-center text-success">+5</td>
                  </tr>

                  <tr>
                    <td class="text-center">2021/11/03</td>
                    <td class="text-center">185</td>
                    <td class="text-center text-danger">-1</td>
                  </tr>
                  <tr>
                    <td class="text-center">2021/11/03</td>
                    <td class="text-center">234</td>
                    <td class="text-center text-success">+2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import { Chart } from 'chart.js';
  import { sleep } from '../../../../utils/helpers.js';

  export default {
    data() {
      return {
        data: null,
        loading: false,
      };
    },
    mounted() {
      this.data = {
        type: 'line',
        data: {
          labels: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
          options: {
            responsive: true,
          },
          datasets: [
            {
              label: 'Number of Moons',
              data: [0, 0, 1, 2, 79, 82, 27, 14],
              backgroundColor: 'rgba(54,73,93,.5)',
              borderColor: '#36495d',
              borderWidth: 3,
            },
            {
              label: 'Planetary Mass (relative to the Sun x 10^-6)',
              data: [0.166, 2.081, 3.003, 0.323, 954.792, 285.886, 43.662, 51.514],
              backgroundColor: 'rgba(71, 183,132,.5)',
              borderColor: '#47b784',
              borderWidth: 3,
            },
          ],
        },
      };
      const ctx = document.getElementById('myChart');
      new Chart(ctx, this.data);
    },
    methods: {
      async logout() {
        this.loading = true;

        await sleep(3000);

        this.$router.push({ path: '/dashboard/login' });
      },
    },
  };
</script>
