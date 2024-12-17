import Icon from "@mui/material/Icon";
import SignIn from "pages/Auth/SignIn";
import SignUp from "pages/Auth/SignUp";
import SignOut from "pages/Auth/SignOut";
import Profile from "pages/Auth/Profile";
import AboutUs from "layouts/pages/landing-pages/about-us";
import { useAuth } from "contexts/AuthContext";

export const getRoutes = (user) => {


  const baseRoutes = [
    {
      name: "pages",
      icon: <Icon>dashboard</Icon>,
      route: "/pages/landing-pages/about-us",
      component: <AboutUs />,
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

  return [
    ...baseRoutes,
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


