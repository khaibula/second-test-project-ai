import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoList from '../../../widgets/todo-list/ui/TodoList';
import { useAuthStore } from '../../../features/auth';
import styles from './TodosPage.module.css';

const TodosPage = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentContainer}>
        <TodoList />
      </div>
    </div>
  );
};

export default TodosPage; 