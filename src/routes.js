import Icon from "@mui/material/Icon";
import SignIn from "pages/Auth/SignIn";
import SignUp from "pages/Auth/SignUp";
import SignOut from "pages/Auth/SignOut";
import Profile from "pages/Auth/Profile";
import AboutUs from "pages/LandingPages/AboutUs";
import { useAuth } from "contexts/AuthContext";
import VerifyEmail from "pages/Auth/VerifyEmail";
import ServiceDetail from "pages/SpaServices/ServiceDetail";
import CategoryDetail from "pages/SpaServices/CategoryDetail";
import Checkout from "pages/Checkout/Checkout";

export const getRoutes = (user) => {


  const baseRoutes = [
    {
      name: "pages",
      icon: <Icon>dashboard</Icon>,
      route: "/pages/landing-pages/about-us",
      component: <AboutUs />,

    },
    {
      icon: <Icon>
        shopping_cart
      </Icon>,
      name: "Sevice Checkout",
      route: "/checkout",
      component: <Checkout />,
    },
  ];

  const authRoutes = user
    ? [
      { name: "sign out", route: "/auth/sign-out", component: <SignOut /> },
      { name: "profile", route: "/auth/profile", component: <Profile /> },
    ]
    : [
      { name: "sign in", route: "/auth/sign-in", component: <SignIn /> },
      { name: "sign up", route: "/auth/sign-up", component: <SignUp /> },
    ];

  //hidden routes (hidden from the sidebar)
  const hiddenRoutes = [
    { name: "verify email", route: "/auth/verify-email", component: <VerifyEmail />, hidden: true },
    // {
    //   name: "service detail",
    //   route: "/cat/:catId/service/:serviceId",
    //   component: <ServiceDetail />,
    //   hidden: false,
    // },

    {
      name: "category detail",
      route: "/cat-:catId",
      component: <CategoryDetail />,
      hidden: true,
    },


  ];

  return [
    ...baseRoutes, ...hiddenRoutes,
    {
      name: "account",
      columns: 1,
      rowsPerColumn: 2,
      icon: <Icon>account_circle</Icon>,
      collapse: [
        {
          name: "account",
          collapse: authRoutes,
        },
      ],
    },
  ];
};


