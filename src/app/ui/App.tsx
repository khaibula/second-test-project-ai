import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuthPage from '../../pages/auth/ui/AuthPage';
import TodosPage from '../../pages/todos/ui/TodosPage';
import ProtectedRoute from '../../features/auth/ui/protected-route/ProtectedRoute';
import styles from '../styles/App.module.css';

// Компонент для анимированного перехода между страницами
const AnimatedRoutes = () => {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(true);
  
  useEffect(() => {
    setIsAnimating(true);
  }, [location.pathname]);

  return (
    <div className={`${styles.contentWrapper} ${isAnimating ? styles.fadeIn : ''}`}>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route 
          path="/todos" 
          element={
            <ProtectedRoute>
              <TodosPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className={styles.app}>
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
