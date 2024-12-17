// components/AppRoutes.js
import { Routes, Route, Navigate } from "react-router-dom";
import Presentation from "layouts/pages/presentation";

export default function AppRoutes({ routes }) {
  return (
    <Routes>
      {routes.map((route, index) => 
        route.collapse
          ? route.collapse.map((subRoute, subIndex) =>
              subRoute.route && subRoute.component && (
                <Route
                  path={subRoute.route}
                  element={subRoute.component}
                  key={`${index}-${subIndex}`}
                />
              )
            )
          : route.route &&
            route.component && (
              <Route path={route.route} element={route.component} key={index} />
            )
      )}
      <Route path="/" element={<Presentation />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
