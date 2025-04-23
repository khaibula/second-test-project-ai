import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../../features/auth/ui/auth-form/AuthForm';
import { useAuthStore } from '../../../features/auth';
import styles from './AuthPage.module.css';

const AuthPage = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <h1 className={styles.appTitle}>
          Todo App
        </h1>
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage; 