export const routes = {
  login: "/login",
  register: "/register",

  home: "/(tabs)",
  plants: "/(tabs)/plants",
  notifications: "/(tabs)/notifications",
  sensors: "/(tabs)/sensors",
  profile: "/(tabs)/profile",

  addPlant: "/(tabs)/add-plant",
  addSensor: "/add-sensor",

  plantDetails: (id: string) => `/plant-details/${id}` as const,
} as const;
