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
import CartDetail from "pages/CartDetail";
import ProductDetail from "pages/ProductDetail";
import { CartProvider } from "contexts/CartContext";
import ProductCheckout from "pages/ProductCheckout";
import Payment from "pages/Payment";
import UserOrderDetail from "pages/Auth/sections/UserOrderDetail";

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
    //http://localhost:3000/payment/vnpay_ipn?vnp_Amount=508300000&vnp_BankCode=NCB&vnp_BankTranNo=VNP14793919&vnp_CardType=ATM&vnp_OrderInfo=Thanh+toan+don+hang+21&vnp_PayDate=20250115161942&vnp_ResponseCode=00&vnp_TmnCode=CIII2H79&vnp_TransactionNo=14793919&vnp_TransactionStatus=00&vnp_TxnRef=21&vnp_SecureHash=718f8411cb24b7d535c9cbd45d1730fdf2526c3009905d5666372623615e623f42d8f0b16bc417c6506b7335a7cb236c1d11e8d39463489986d413423c173b3f

    return (

      <Routes>
        {mapRoutes(routes)}
        <Route path="/payment/vnpay_ipn" element={<Payment />} />
        <Route path="/cat/:catId/service/:serviceId" element={<ServiceDetail />} />
        <Route path="/auth/profile/user-order-detail/:orderId" element={<UserOrderDetail />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<CartDetail />} />
        <Route path="/product-checkout" element={<ProductCheckout />} />
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
  }, [location, routes, loading]);

  return null;  // Không render gì, chỉ cập nhật title
}


export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    // Close navbar and collapse
    const closeNavbar = () => {
      const event = new Event("closeNavbar");
      window.dispatchEvent(event);
    };
    closeNavbar();
  }, [pathname]);

  return (


    <BookingProvider>
      <CartProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <AppNavbar />
          <AppRoutes />
          <TitleUpdater />
          <MKBox pt={6} px={1} mt={6}>
            <DefaultFooter content={footerRoutes} />
          </MKBox>
        </ThemeProvider>
      </CartProvider>
    </BookingProvider>


  );
}
