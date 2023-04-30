import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Bookings from "../pages/Bookings";
import SellCar from "../pages/SellCar";
import Settings from "../pages/Settings";
import Cars from "../pages/Cars";
import Staffs from "../pages/Staffs";
import Login from "../pages/login/Login";
import useToken from "../axios/useToken";

const Router = () => {
  const ProtectedRoute = ({ children }) => {
    const [token, setToken] = useToken();

    let admin = false;
    if (JSON.parse(token)?.user?.role === "Admin") {
      admin = true;
    }

    if (!admin) return <Navigate to="/login" />;

    return children;
  };
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cars"
        element={
          <ProtectedRoute>
            <Cars />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staffs"
        element={
          <ProtectedRoute>
            <Staffs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <Bookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sell-car"
        element={
          <ProtectedRoute>
            <SellCar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default Router;
