<template>
  <div class="container-fluid" id="body-div">
    <h2>RPE Max rep estimator</h2>
    <form>
      <div class="form-group">
        <label for="rpe">RPE:</label>
        <select class="form-control" id="rpe">
          <option value="10">10</option>
          <option value="9.5">9.5</option>
          <option value="9">9</option>
          <option value="8.5">8.5</option>
          <option value="8">8</option>
          <option value="7.5">7.5</option>
          <option value="7">7</option>
          <option value="6.5">6.5</option>
        </select>
      </div>
      <div class="form-group">
        <label for="weight">Weight:</label>
        <input type="text" class="form-control" id="weight" placeholder="Weight" />
      </div>
      <div class="form-group">
        <label for="reps">Reps:</label>
        <input type="text" class="form-control" id="reps" placeholder="Reps (1-10)" />
      </div>
      <button type="button" class="btn btn-default bg-secondary" id="calculate">Calculate</button>
    </form>
    <div id="rpemax" style="display: none">
      <h2>Estimated Max Lifts:</h2>
      <p>
        With a lift of <span id="weightspan"></span> x <span id="repspan"></span> @<span
          id="rpespan"
        ></span>
      </p>
      <p>Potential Max: <span id="max"></span></p>
    </div>
    <small class="text-muted"
      >Ratios lovingly borrowed from Mike Tuchscherer’s
      <a href="http://www.reactivetrainingsystems.com/">Reactive Training Systems</a></small
    >
    <h3>What is Rate of Perceived Exertion (RPE)?</h3>
    <div class="container-fluid">
      <p>
        RPE is a method to give a subjective measurement of how difficult any given set was. This is
        often useful as your bodies ability to perform is not consistent and RPE can give a good
        indicator of how you are performing on a given day.
      </p>
      <p>
        The main draw back with this method is the fact that it is subjective, which means there is
        room for error.
      </p>
      <p>
        To help you be more consistent with your RPE values here is a basic description of what each
        number means:
      </p>
      <ul class="list-unstyled">
        <li><b>10</b>: Maximal effort</li>
        <li><b>9.5</b>: Maybe could of done one more rep</li>
        <li><b>9</b>: Definitely could do one more rep</li>
        <li><b>8.5</b>: Maybe could do two more reps</li>
        <li><b>8</b>: Definitely could do two more reps</li>
        <li><b>7.5</b>: Maybe could of done three more reps</li>
        <li><b>7</b>: Fairly easy with quick speed</li>
        <li><b>6.5</b>: Borderline warmup set</li>
      </ul>
    </div>
  </div>
</template>
