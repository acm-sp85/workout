export const WORKOUT_SCHEDULE = {
  dayA: {
    name: 'Lower Body + Core Stability',
    day: 'Monday',
    focus: 'Fat-burning via large muscles, hip mobility',
    rounds: 3,
    restBetween: '20s',
    warmup: [
      { id: 'cardio_march', duration: '60 sec' },
      { id: 'mob_hip_circles', duration: '30s each' },
      { id: 'mob_lunge_twist', duration: '6 per side' },
      { id: 'mob_cat_cow', duration: '6-8 reps' },
      { id: 'squat_bodyweight', duration: '10 reps' },
    ],
    circuit: [
      { id: 'squat_goblet', reps: '12-15 reps', equipment: '8kg' },
      { id: 'lunge_reverse', reps: '8-10/leg', equipment: 'Bodyweight' },
      { id: 'glute_bridge', reps: '15 reps', equipment: '5-8kg' },
      { id: 'core_dead_bug', reps: '8-10/side', equipment: 'None' },
      { id: 'cardio_high_knees', reps: '40 sec', equipment: 'None' },
    ],
    cooldown: [
      { id: 'stretch_hip_flexor', duration: '30s/side' },
      { id: 'stretch_hamstring', duration: '30s/side' },
      { id: 'stretch_figure4', duration: '30s/side' },
      { id: 'breath_supine', duration: '1 min' },
    ]
  },
  dayB: {
    name: 'Upper Body + Core',
    day: 'Tuesday',
    focus: 'Posture & Strength',
    rounds: 3,
    restBetween: '20s',
    warmup: [
      { id: 'mob_arm_circles', duration: '60 sec' },
      { id: 'mob_pendulum', duration: '30s each' },
      { id: 'scapular_retraction', duration: '12 reps' },
      { id: 'pushup_wall', duration: '10 reps' },
    ],
    circuit: [
      { id: 'pushup_incline', reps: '8-12 reps', equipment: 'Bench' },
      { id: 'row_one_arm', reps: '10/arm', equipment: '5-8kg' },
      { id: 'core_plank', reps: '30-45 sec', equipment: 'None' },
      { id: 'rdl_dumbbell', reps: '12-15 reps', equipment: '2x5kg' },
      { id: 'core_pallof', reps: '30 sec', equipment: 'Band/DB' },
    ],
    cooldown: [
      { id: 'stretch_chest', duration: '30 sec' },
      { id: 'stretch_upper_back', duration: '30 sec' },
      { id: 'breath_supine', duration: '1 min' },
    ]
  },
  dayC: {
    name: 'Mobility + Conditioning',
    day: 'Thursday',
    focus: 'Joint health & Sweat',
    rounds: 4, 
    restBetween: 'None',
    warmup: [
      { id: 'cardio_jacks', duration: '60 sec' },
      { id: 'mob_worlds_greatest', duration: '3/side' },
      { id: 'mob_hip_openers', duration: '30 sec' },
      { id: 'mob_arm_circles', duration: '30 sec' },
    ],
    circuit: [
      { id: 'squat_calf_raise', reps: '12 reps', equipment: 'None' },
      { id: 'lunge_knee_drive', reps: '8/side', equipment: 'None' },
      { id: 'bear_crawl', reps: '30 sec', equipment: 'None' },
      { id: 'cardio_mountain_climbers', reps: '30 sec', equipment: 'None' },
      { id: 'core_hollow_hold', reps: '30 sec', equipment: 'None' },
    ],
    cooldown: [
      { id: 'stretch_squat_hold', duration: '60 sec' },
      { id: 'stretch_hip_flexor', duration: '30s/side' },
      { id: 'stretch_spinal_twist', duration: '30s/side' },
      { id: 'breath_nasal', duration: '1 min' },
    ]
  },
  dayD: {
    name: 'Core + Metabolic',
    day: 'Friday',
    focus: 'Midsection & Cardio',
    rounds: 3,
    restBetween: '20s',
    warmup: [
      { id: 'cardio_march', duration: '60 sec' },
      { id: 'mob_torso_rotation', duration: '30 sec' },
      { id: 'glute_bridge', duration: '10 reps' },
      { id: 'core_dead_bug', duration: '6/side' },
    ],
    circuit: [
      { id: 'core_side_plank', reps: '30s/side', equipment: 'None' },
      { id: 'core_bicycle', reps: '10-12/side', equipment: 'None' },
      { id: 'carry_suitcase', reps: '30s/side', equipment: '8kg' },
      { id: 'squat_pulses', reps: '20 sec', equipment: 'None' },
      { id: 'cardio_shadow_boxing', reps: '40 sec', equipment: 'None' },
    ],
    cooldown: [
      { id: 'stretch_cobra', duration: '30 sec' },
      { id: 'stretch_childs_pose', duration: '60 sec' },
      { id: 'breath_supine', duration: '1 min' },
    ]
  }
};