const FORMAT_TYPE = [
  "Men's Doubles 3.0-4.0",
  "Men's Doubles 4.0-5.0",
  'Mixed Doubles 4.0-5.0',
  "Women's Doubles 3.5-4.5",
  "Women's Doubles 3.5-4.5",
];

const MEMBERS = [
  {
    id: 1,
    userProfile: {
      player_1_fullName: 'Zain Dokidis',
      player_2_fullName: 'Ruben Kenter',
      profile_image_1: '/images/test/user.png',
      profile_image_2: '/images/test/user_2.png',
    },
    format: FORMAT_TYPE[0],
  },
  {
    id: 2,
    userProfile: {
      player_1_fullName: 'Nolan Workman',
      player_2_fullName: 'Emerson Vetrovs',
      profile_image_1: '/images/test/user.png',
      profile_image_2: '/images/test/user_2.png',
    },
    format: FORMAT_TYPE[0],
  },
  {
    id: 3,
    userProfile: {
      player_1_fullName: 'Jaylon Calzoni',
      player_2_fullName: 'Cooper Gouse',
      profile_image_1: '/images/test/user.png',
      profile_image_2: '/images/test/user_2.png',
    },
    format: FORMAT_TYPE[0],
  },
  {
    id: 4,
    userProfile: {
      player_1_fullName: 'Zain Dokidis',
      player_2_fullName: 'Ruben Kenter',
      profile_image_1: '/images/test/user.png',
      profile_image_2: '/images/test/user_2.png',
    },
    format: FORMAT_TYPE[0],
  },
  {
    id: 5,
    userProfile: {
      player_1_fullName: 'Nolan Lipshutz',
      player_2_fullName: 'Alfredo Stanton',
      profile_image_1: '/images/test/user.png',
      profile_image_2: '/images/test/user_2.png',
    },
    format: FORMAT_TYPE[4],
  },
  {
    id: 6,
    userProfile: {
      player_1_fullName: 'Terry Bothman',
      player_2_fullName: 'Ruben Baptista',
      profile_image_1: '/images/test/user.png',
      profile_image_2: '/images/test/user_2.png',
    },
    format: FORMAT_TYPE[5],
  },
];
export const groups = {
  format: FORMAT_TYPE,
  teams: MEMBERS,
};
