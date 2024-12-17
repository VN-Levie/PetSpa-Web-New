import { useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import theme from "assets/theme";
import Presentation from "layouts/pages/presentation";

import routes from "routes";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import { AuthProvider, useAuth } from "contexts/AuthContext";
export default function App() {
  const { pathname } = useLocation();
  const user = useAuth();
  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });
  console.log("ok ok");

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DefaultNavbar routes={routes} sticky center="false" />
        <Routes>
          {getRoutes(routes)}
          <Route path="/" element={<Presentation />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

      </ThemeProvider>
    </AuthProvider>
  );
}
