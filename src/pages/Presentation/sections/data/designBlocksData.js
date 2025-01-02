
const imagesPrefix =
  "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-design-system/presentation/sections";

export default [
  {
    title: "Title od sevice category 1",
    description: "Description of service category1",
    items: [
      {
        image: `images`, // Image for the service
        name: "Name of service", // Name of the service
        description: "Description of service", // Description of the service
        route: "/sevice-{cat-id}/{sevice-id}", // Route for the service
      }
    ],
  },
  {
    title: "Title od sevice category 2",
    description: "Description of service category2",
    items: [
      {
        image: `images`, // Image for the service
        name: "Name of service", // Name of the service
        description: "Description of service", // Description of the service
        route: "/sevice-{cat-id}/{sevice-id}", // Route for the service
      },
      {
        image: `images`, // Image for the service
        name: "Name of service", // Name of the service
        description: "Description of service", // Description of the service
        route: "/sevice-{cat-id}/{sevice-id}", // Route for the service
      },
      
    ],
  },
  {
    title: "Input Areas",
    description: "50+ elements that you need for text manipulation and insertion",
    items: [
      {
        image: `${imagesPrefix}/newsletters.jpg`,
        name: "Newsletters",
        description: 6,
        pro: true,
      },
      {
        image: `${imagesPrefix}/contact-sections.jpg`,
        name: "Contact Sections",
        description: 8,
        pro: true,
      },
      {
        image: `${imagesPrefix}/forms.jpg`,
        name: "Forms",
        description: 3,
        route: "/sections/input-areas/forms",
      },
      {
        image: `${imagesPrefix}/inputs.jpg`,
        name: "Inputs",
        description: 6,
        route: "/sections/input-areas/inputs",
      },
    ],
  },
  {
    title: "Attention Catchers",
    description: "20+ Fully coded components that popup from different places of the screen",
    items: [
      {
        image: `${imagesPrefix}/alerts.jpg`,
        name: "Alerts",
        description: 4,
        route: "/sections/attention-catchers/alerts",
      },
      {
        image: `${imagesPrefix}/toasts.jpg`,
        name: "Notifications",
        description: 3,
        pro: true,
      },
      {
        image: `${imagesPrefix}/popovers.jpg`,
        name: "Tooltips & Popovers",
        description: 2,
        route: "/sections/attention-catchers/tooltips-popovers",
      },
      {
        image: `${imagesPrefix}/modals.jpg`,
        name: "Modals",
        description: 5,
        route: "/sections/attention-catchers/modals",
      },
    ],
  },
  {
    title: "Elements",
    description: "80+ carefully crafted small elements that come with multiple colors and shapes",
    items: [
      {
        image: `${imagesPrefix}/buttons.jpg`,
        name: "Buttons",
        description: 6,
        route: "/sections/elements/buttons",
      },
      {
        image: `${imagesPrefix}/avatars.jpg`,
        name: "Avatars",
        description: 2,
        route: "/sections/elements/avatars",
      },
      {
        image: `${imagesPrefix}/dropdowns.jpg`,
        name: "Dropdowns",
        description: 2,
        route: "/sections/elements/dropdowns",
      },
      {
        image: `${imagesPrefix}/switch.jpg`,
        name: "Toggles",
        description: 2,
        route: "/sections/elements/toggles",
      },
      {
        image: `${imagesPrefix}/social-buttons.jpg`,
        name: "Social Buttons",
        description: 2,
        pro: true,
      },
      {
        image: `${imagesPrefix}/breadcrumbs.jpg`,
        name: "Breadcrumbs",
        description: 1,
        route: "/sections/elements/breadcrumbs",
      },
      {
        image: `${imagesPrefix}/badges.jpg`,
        name: "Badges",
        description: 3,
        route: "/sections/elements/badges",
      },
      {
        image: `${imagesPrefix}/progress.jpg`,
        name: "Progress Bars",
        description: 4,
        route: "/sections/elements/progress-bars",
      },
      {
        image: `${imagesPrefix}/tables.jpg`,
        name: "Tables",
        description: 3,
        pro: true,
      },
      {
        image: `${imagesPrefix}/typography.jpg`,
        name: "Typography",
        description: 2,
        route: "/sections/elements/typography",
      },
    ],
  },
];
