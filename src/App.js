import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "assets/theme";
import Presentation from "layouts/pages/presentation";
import { AuthProvider, useAuth } from "contexts/AuthContext";
import { getRoutes } from "routes";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import footerRoutes from "footer.routes";
import MKBox from "components/MKBox";
import DefaultFooter from "examples/Footers/DefaultFooter";
function AppRoutes() {
  const { user, loading } = useAuth();
  const routes = getRoutes(user);

  const mapRoutes = (allRoutes) =>
    allRoutes.map((route, index) => {
      if (route.collapse) {
        return mapRoutes(route.collapse);
      }

      if (route.route && route.component) {
        return <Route path={route.route} element={route.component} key={index} />;
      }

      return null;
    });

  if (!loading) {

    return (
      <Routes>
        {mapRoutes(routes)}
        <Route path="/" element={<Presentation />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }
}


function AppNavbar() {
  const { user } = useAuth();
  const routes = getRoutes(user);
  return <DefaultNavbar routes={routes} sticky center={false} />;
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
        <AppNavbar />
        <AppRoutes />
        <MKBox pt={6} px={1} mt={6}>
          <DefaultFooter content={footerRoutes} />
        </MKBox>
      </ThemeProvider>
    </AuthProvider>

  );
}
