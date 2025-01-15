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
import HotelBooking from "pages/HotelBooking/HotelBooking";
import Service from "pages/Service/Service";
import Shop from "pages/Shop";
import CartDetail from "pages/CartDetail";
import ProductDetail from "pages/ProductDetail";
import ProductCheckout from "pages/ProductCheckout";
import { useCart } from "contexts/CartContext";
import { useBooking } from "contexts/BookingContext";
import ReviewAndConfirmOrder from "pages/ReviewAndConfirmOrder";
import Dashboard from "pages/Dashboard";
export const getRoutes = (user) => {
  const { cart } = useCart();
  const countCartItems = cart.length;

  const { bookingData } = useBooking();
  const countBookingItems = bookingData.selectedServices.length;
  const baseRoutes = [
    // {
    //   name: "pages",
    //   icon: <Icon>dashboard</Icon>,
    //   route: "/pages/landing-pages/about-us",
    //   component: <AboutUs />,

    // },

    {
      icon: <Icon>hotel</Icon>,
      name: "Hotel Booking",
      route: "/hotel-booking",
      component: <HotelBooking />,
    },
    {
      icon: <Icon>
        shopping_cart
      </Icon>,
      name: "Services",
      route: "/services",
      component: <Service />,
    },
    {
      icon: <Icon>
        shopping_cart
      </Icon>,
      name: "Sevice Cart",
      route: "/checkout",
      component: <Checkout />,
      count: countBookingItems,
    },
    {
      icon: <Icon>store</Icon>,
      name: "Pet Shop",
      route: "/shop",
      component: <Shop />,
    },

    {
      icon: <Icon>shopping_cart</Icon>,
      name: "Cart",
      route: "/cart",
      component: <CartDetail />,
      count: countCartItems,
    },
    {
      icon: <Icon>info</Icon>,
      name: "Product Detail",
      route: "/product/:productId",
      component: <ProductDetail />,
      hidden: true,
    },
    {
      icon: <Icon>shopping_cart</Icon>,
      name: "Product Checkout",
      route: "/product-checkout",
      component: <ProductCheckout />,
      hidden: true,
    },
    {
      icon: <Icon>shopping_cart</Icon>,
      name: "review-and-confirm-order",
      route: "/review-and-confirm-order",
      component: <ReviewAndConfirmOrder />,
      hidden: true,
    },
  ];

  const authRoutes = user
    ? [
      { name: "profile", route: "/auth/profile", component: <Profile /> },
      ...(user.role === "Admin" || user.role === "ADMIN"
        ? [{ name: "dashboard", route: "/auth/dashboard", component: <Dashboard /> }]
        : []),
      { name: "sign out", route: "/auth/sign-out", component: <SignOut /> },
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


