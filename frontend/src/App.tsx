import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Quizzes from "./pages/Quizzes";
import Quiz from "./pages/Quiz";
import Admin from "./pages/Admin";
import About from "./pages/About";
import QA from "./pages/QA";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";

function App() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" />}
          />
          <Route
            path="/quizzes"
            element={user ? <Quizzes /> : <Navigate to="/login" />}
          />
          <Route
            path="/quizzes/:id"
            element={user ? <Quiz /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={user?.role === "ADMIN" ? <Admin /> : <Navigate to="/" />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/qa" element={<QA />} />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
