import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "assets/theme";
import Presentation from "layouts/pages/presentation";
import { AuthProvider, useAuth } from "contexts/AuthContext";
import { getRoutes } from "routes";

function AppRoutes() {
  const { user } = useAuth();
  const routes = getRoutes(user);

  const mapRoutes = (allRoutes) =>
    allRoutes.map((route, index) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route && route.component) {
        return <Route path={route.route} element={route.component} key={index} />;
      }

      return null;
    });

  return (
    <Routes>
      {mapRoutes(routes)}
      <Route path="/" element={<Presentation />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </AuthProvider>
  );
}
