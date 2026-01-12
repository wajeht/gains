const RICK_ROLL = {
  youtube_video_id: 'dQw4w9WgXcQ',
  youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  youtube_embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  youtube_thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
};

const EXERCISES = [
  { name: 'Squat', category: 'Legs' },
  { name: 'Bench Press', category: 'Chest' },
  { name: 'Deadlift', category: 'Back' },
  { name: 'Overhead Press', category: 'Shoulders' },
  { name: 'Barbell Row', category: 'Back' },
];

const SESSION_NAMES = ['Upper Body A', 'Lower Body A', 'Push Day', 'Pull Day', 'Leg Day'];

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Check if demo user already exists
  const existingUser = await knex('users').where({ email: 'demo@gains.dev' }).first();
  if (existingUser) {
    console.log('Demo data already exists, skipping seed');
    return;
  }

  // Create demo user
  const [user] = await knex('users')
    .insert({
      username: 'demo_lifter',
      email: 'demo@gains.dev',
    })
    .returning('*');

  // Create user details
  await knex('user_details').insert({
    user_id: user.id,
    first_name: 'Demo',
    last_name: 'Lifter',
    bio: 'Just here to make gains!',
    weight: 180,
    profile_picture_url: 'https://dummyimage.com/200x200/3498db/ffffff&text=DL',
  });

  // Create exercise categories
  const categories = {};
  for (const cat of ['Legs', 'Chest', 'Back', 'Shoulders', 'Arms']) {
    const [category] = await knex('exercise_categories')
      .insert({ name: cat, user_id: user.id })
      .returning('*');
    categories[cat] = category.id;
  }

  // Create exercises
  const exercises = {};
  for (const ex of EXERCISES) {
    const [exercise] = await knex('exercises')
      .insert({
        name: ex.name,
        exercise_category_id: categories[ex.category],
        user_id: user.id,
      })
      .returning('*');
    exercises[ex.name] = exercise.id;
  }

  // Create sessions with logs, sets, variables, and videos
  for (let i = 0; i < SESSION_NAMES.length; i++) {
    const sessionName = SESSION_NAMES[i];
    const daysAgo = (SESSION_NAMES.length - i) * 2;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    // Create session
    const [session] = await knex('sessions')
      .insert({
        name: sessionName,
        user_id: user.id,
        start_date: startDate,
        end_date: endDate,
        session_rpe: Math.floor(Math.random() * 3) + 7, // 7-9
        notes: `Great ${sessionName.toLowerCase()} workout!`,
      })
      .returning('*');

    // Create variables for session
    await knex('variables').insert({
      user_id: user.id,
      session_id: session.id,
      body_weight: 180 + Math.floor(Math.random() * 5),
      hours_of_sleep: 6 + Math.floor(Math.random() * 3),
      caffeine_intake: Math.floor(Math.random() * 300),
      calories_prior_session: 500 + Math.floor(Math.random() * 500),
      stress_level: Math.floor(Math.random() * 5) + 1,
    });

    // Create 2-3 logs per session with videos
    const exerciseKeys = Object.keys(exercises);
    const numLogs = 2 + Math.floor(Math.random() * 2);

    for (let j = 0; j < numLogs; j++) {
      const exerciseName = exerciseKeys[(i + j) % exerciseKeys.length];
      const exerciseId = exercises[exerciseName];

      // Create log
      const [log] = await knex('logs')
        .insert({
          name: exerciseName,
          user_id: user.id,
          session_id: session.id,
          exercise_id: exerciseId,
          private: false,
          notes: `Working on ${exerciseName.toLowerCase()} form`,
        })
        .returning('*');

      // Create 3-5 sets per log
      const numSets = 3 + Math.floor(Math.random() * 3);
      for (let k = 0; k < numSets; k++) {
        await knex('sets').insert({
          user_id: user.id,
          session_id: session.id,
          log_id: log.id,
          exercise_id: exerciseId,
          reps: 5 + Math.floor(Math.random() * 6),
          weight: 135 + Math.floor(Math.random() * 100),
          rpe: 6 + Math.floor(Math.random() * 4),
        });
      }

      // Create video with Rick Roll for first log of each session
      if (j === 0) {
        await knex('videos').insert({
          user_id: user.id,
          session_id: session.id,
          log_id: log.id,
          ...RICK_ROLL,
        });
      }
    }
  }

  // Create a second demo user to follow/message
  const [user2] = await knex('users')
    .insert({
      username: 'gym_bro',
      email: 'gymbro@gains.dev',
    })
    .returning('*');

  await knex('user_details').insert({
    user_id: user2.id,
    first_name: 'Gym',
    last_name: 'Bro',
    bio: 'No pain no gain!',
    weight: 200,
    profile_picture_url: 'https://dummyimage.com/200x200/e74c3c/ffffff&text=GB',
  });

  // Create follow relationship
  await knex('follows').insert({
    follower_id: user.id,
    following_id: user2.id,
  });

  // Create some messages
  await knex('messages').insert([
    {
      sender_id: user2.id,
      recipient_id: user.id,
      content: 'Hey! Nice lifts today!',
    },
    {
      sender_id: user.id,
      recipient_id: user2.id,
      content: 'Thanks bro! Working on that squat PR',
    },
    {
      sender_id: user2.id,
      recipient_id: user.id,
      content: 'You got this! 💪',
    },
  ]);

  console.log('Demo data seeded successfully!');
  console.log(`  - User: demo@gains.dev (demo_lifter)`);
  console.log(`  - User: gymbro@gains.dev (gym_bro)`);
  console.log(`  - ${SESSION_NAMES.length} sessions with videos`);
}
