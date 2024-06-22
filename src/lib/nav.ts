export const routes: {
  path: string;
  name: string;
  icon: string;
  autoLinkable?: boolean;
  description?: string;
  children?: {
    path: string;
    name: string;
    icon: string;
    autoLinkable?: boolean;
    description?: string;
  }[];
}[] = [
  { path: "/", name: "Home", icon: "home", autoLinkable: false },
  { path: "/about", name: "About", icon: "info", autoLinkable: false },
  {
    path: "/teams",
    name: "Teams",
    icon: "users",
    autoLinkable: true,
    description:
      "Manage what teams will be a part of your game and their players",
    children: [
      {
        path: "/players",
        name: "Players",
        icon: "users",
        autoLinkable: true,
        description:
          "Manage the players in your game how they look like and who they are",
      },
      {
        path: "/sponsors",
        name: "Sponsors",
        icon: "users",
        autoLinkable: true,
        description:
          "Manage the game sponsors and what teams they have a part in",
      },

      {
        path: "/stats",
        name: "Stats",
        icon: "chart-bar",
        autoLinkable: true,
        description:
          "See historic data about past games, kill counts, winrates, and more",
      },
    ],
  },
  {
    path: "/events",
    name: "Events",
    icon: "calendar",
    autoLinkable: true,
    description:
      "Manage the events that will happen in your game, add new events and update existing ones",
    children: [
      {
        path: "/locations",
        name: "Locations",
        icon: "map",
        autoLinkable: true,
        description:
          "Manage the locations that will be a part of your game and their events",
      },
      {
        path: "/hazards",
        name: "Hazards",
        icon: "map",
        autoLinkable: true,
        description:
          "Manage the hazards that will be a part of your game and their events",
      },
    ],
  },
  {
    path: "/play",
    name: "Play",
    icon: "game-play",
    description: "Simulate a game and see how fate decides the outcome",
    children: [
      {
        path: "/history",
        name: "History",
        icon: "history",
        description:
          "See the history of past games and who won, who died first and every single event that occurred",
      },
    ],
  },
];
