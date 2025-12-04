// assets/avatars/avatarConfig.js

export const AVATARS = {
  // keys that will be stored in DB
  m1_tan_blackhair: require("./avatar_m1_tan_blackhair.png"),
  m2_dark_blackhair: require("./avatar_m2_dark_blackhair.png"),
  m3_light_brownhair: require("./avatar_m3_light_brownhair.png"),
  m4_brown_blondehair: require("./avatar_m4_brown_blondehair.png"),
  m5_light_redhair: require("./avatar_m5_light_redhair.png"),
  m6_medium_browncurly: require("./avatar_m6_medium_browncurly.png"),
  m7_dark_browncurly: require("./avatar_m7_dark_browncurly.png"),
  m8_light_blackhair: require("./avatar_m8_light_blackhair.png"),
  // add more as you go
};

// convenient list for your picker UI
export const AVATAR_KEYS = Object.keys(AVATARS);
