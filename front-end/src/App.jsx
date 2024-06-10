import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/Auth/RegisterPage.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import "./App.css";
import DashBoardPage from "./pages/Quiz/DashBoardPage.jsx";
import AnalyticsPage from "./pages/Quiz/AnalyticsPage.jsx";
import { AuthProvider } from "./utils/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";
import CreateQuizPage from "./pages/Quiz/CreateQuizPage.jsx";
import QuizAnalysis from "./components/Quiz/Analytics/QuizAnalysis.jsx";
import PollAnalysis from "./components/Quiz/Analytics/PollAnalysis.jsx";
import QuizViewer from "./components/Viewer/QuizViewer.jsx";
import PollViewer from "./components/Viewer/PollViewer.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashBoardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics/"
            element={
              <PrivateRoute>
                <AnalyticsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/quiz-analysis/:quizId"
            element={
              <PrivateRoute>
                <QuizAnalysis />
              </PrivateRoute>
            }
          />
          <Route
            path="/poll-analysis/:pollId"
            element={
              <PrivateRoute>
                <PollAnalysis />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-quiz"
            element={
              <PrivateRoute>
                <CreateQuizPage />
              </PrivateRoute>
            }
          />
          <Route path="/quiz/:quizCode" element={<QuizViewer />} />
          <Route path="/poll/:pollCode" element={<PollViewer />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
