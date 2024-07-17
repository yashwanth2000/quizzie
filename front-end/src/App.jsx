import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/Auth/RegisterPage.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import "./App.css";
import DashBoardPage from "./pages/Quiz/DashBoardPage.jsx";
import AnalyticsPage from "./pages/Quiz/AnalyticsPage.jsx";
import PrivateRoute from "./utils/PrivateRoute";
import CreateQuizPage from "./pages/Quiz/CreateQuizPage.jsx";
import QuizAnalysis from "./components/Quiz/Analytics/QuizAnalysis.jsx";
import PollAnalysis from "./components/Quiz/Analytics/PollAnalysis.jsx";
import QuizViewer from "./components/Viewer/QuizViewer.jsx";
import PollViewer from "./components/Viewer/PollViewer.jsx";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashBoardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/create-quiz" element={<CreateQuizPage />} />
            <Route path="/quiz-analysis/:quizId" element={<QuizAnalysis />} />
            <Route path="/poll-analysis/:pollId" element={<PollAnalysis />} />
          </Route>
          <Route path="/quiz/:quizCode" element={<QuizViewer />} />
          <Route path="/poll/:pollCode" element={<PollViewer />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
