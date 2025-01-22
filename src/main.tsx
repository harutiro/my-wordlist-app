import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import QuizPage from './QuizPage';
import './index.css'; // ここでindex.cssをインポート


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/quiz" element={<QuizPage />} />
    </Routes>
  </Router>
);
