import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NoticeDetails from "./pages/NoticeDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/notice/:id"
        element={
          <ProtectedRoute>
            <NoticeDetails />
          </ProtectedRoute>
        }
        />
        <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}
