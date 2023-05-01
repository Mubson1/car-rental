import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Bookings from "../pages/Bookings";
import CarsDetail from "../pages/CarsDetail";
import Settings from "../pages/Settings";
import Cars from "../pages/Cars";
import Login from "../pages/login/Login";
import useToken from "../axios/useToken";
import Damages from "../pages/Damages";
import User from "../pages/Users";
import UserForm from "../pages/UserForm";
import Payments from "../pages/Payments";

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
        path="/users"
        element={
          <ProtectedRoute>
            <User />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/new"
        element={
          <ProtectedRoute>
            <UserForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/edit/:userId"
        element={
          <ProtectedRoute>
            <UserForm />
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
        path="/payments"
        element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/damage-request"
        element={
          <ProtectedRoute>
            <Damages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cars/:id"
        element={
          <ProtectedRoute>
            <CarsDetail />
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
