import * as ExercisesQueries from './exercises.queries.js';

export async function getExercises(req, res) {
  const exercises = await ExercisesQueries.getAllExercises();
  res.json({
    msg: 'ok',
    data: exercises,
  });
}

export async function postExercise(req, res) {
  const body = req.body;
  const created = await ExercisesQueries.createExercise(body);
  res.json({
    msg: 'ok',
    data: created,
  });
}
