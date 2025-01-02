import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import ServiceDetail from "pages/SpaServices/ServiceDetail";
import CategoryDetail from "pages/SpaServices/CategoryDetail";
import { BookingProvider } from "contexts/BookingContext";
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
        <Route path="/cat/:catId/service/:serviceId" element={<ServiceDetail />} />

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

function TitleUpdater() {
  const location = useLocation();
  const { user, loading } = useAuth();
  const routes = getRoutes(user);

  // Hàm để tìm route hiện tại (bao gồm collapse)
  const findCurrentRoute = (allRoutes, currentPath) => {
    for (let route of allRoutes) {
      if (route.collapse) {
        // Đệ quy để tìm trong route con (collapse)
        const found = findCurrentRoute(route.collapse, currentPath);
        if (found) return found;
      }
      if (route.route === currentPath) {
        return route;
      }
    }
    return null;
  };

  useEffect(() => {
    if (loading) {
      document.title = "Loading... | Pet Spa";
      return;
    }

    // Tìm route hiện tại và cập nhật title
    const currentRoute = findCurrentRoute(routes, location.pathname);
    var name = currentRoute ? currentRoute.name : "Pet Spa";
    //viết hoa chữ cái đầu
    name = name.charAt(0).toUpperCase() + name.slice(1);
    document.title = currentRoute
      ? `${name} | Pet Spa`
      : "Pet Spa | Best Service for Your Pets";

    console.log("currentRoute", currentRoute);
  }, [location, routes, loading]);

  return null;  // Không render gì, chỉ cập nhật title
}


export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  return (

    <AuthProvider>
      <BookingProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <AppNavbar />
          <AppRoutes />
          <TitleUpdater />
          <MKBox pt={6} px={1} mt={6}>
            <DefaultFooter content={footerRoutes} />
          </MKBox>
        </ThemeProvider>
      </BookingProvider>
    </AuthProvider>


  );
}
