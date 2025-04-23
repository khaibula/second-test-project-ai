import { useState, useCallback, useMemo } from 'react';
import { useTodoStore } from '../../../entities/todo';
import { useAuthStore } from '../../../features/auth';
import TodoComponent from '../../../entities/todo/ui/todo-item/Todo';
import styles from './TodoList.module.css';
import { Todo as TodoType } from '../../../shared/types';

type FilterType = 'all' | 'active' | 'completed';

const TodoList = () => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const { todos, addTodo, clearCompletedTodos, error } = useTodoStore();
  const { user, logout } = useAuthStore();
  
  // Мемоизация пользовательских задач
  const userTodos = useMemo(() => {
    return todos.filter((todo: TodoType) => todo.userId === user?.id);
  }, [todos, user?.id]);
  
  // Мемоизация отфильтрованных задач
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return userTodos.filter((todo: TodoType) => !todo.completed);
      case 'completed':
        return userTodos.filter((todo: TodoType) => todo.completed);
      default:
        return userTodos;
    }
  }, [userTodos, filter]);
  
  // Мемоизация счетчиков
  const activeTodosCount = useMemo(() => {
    return userTodos.filter((todo: TodoType) => !todo.completed).length;
  }, [userTodos]);
  
  const completedTodosCount = useMemo(() => {
    return userTodos.filter((todo: TodoType) => todo.completed).length;
  }, [userTodos]);
  
  const handleAddTodo = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      addTodo(newTodoTitle.trim());
      setNewTodoTitle('');
    }
  }, [newTodoTitle, addTodo]);

  const handleFilterChange = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
  }, []);
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Список задач</h1>
        <div className={styles.userInfo}>
          <span className={styles.username}>Привет, {user?.username}</span>
          <button
            onClick={logout}
            className={styles.logoutButton}
          >
            Выйти
          </button>
        </div>
      </div>
      
      <form onSubmit={handleAddTodo} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Добавить новую задачу..."
            className={styles.input}
            aria-label="Добавить новую задачу"
          />
          <button
            type="submit"
            className={styles.addButton}
            disabled={!newTodoTitle.trim()}
          >
            Добавить
          </button>
        </div>
        {error && <p className={styles.errorText} role="alert">{error}</p>}
      </form>

      {userTodos.length > 0 && (
        <div className={styles.filters}>
          <button 
            className={`${styles.filterButton} ${filter === 'all' ? styles.filterButtonActive : ''}`}
            onClick={() => handleFilterChange('all')}
            aria-pressed={filter === 'all'}
          >
            Все
          </button>
          <button 
            className={`${styles.filterButton} ${filter === 'active' ? styles.filterButtonActive : ''}`}
            onClick={() => handleFilterChange('active')}
            aria-pressed={filter === 'active'}
          >
            Активные
          </button>
          <button 
            className={`${styles.filterButton} ${filter === 'completed' ? styles.filterButtonActive : ''}`}
            onClick={() => handleFilterChange('completed')}
            aria-pressed={filter === 'completed'}
          >
            Завершенные
          </button>
        </div>
      )}

      <ul className={styles.todoList}>
        {filteredTodos.map((todo: TodoType) => (
          <TodoComponent 
            key={todo.id} 
            todo={todo} 
            // Предполагается, что TodoComponent принимает toggleTodo и removeTodo из хука
            // Если нет, их нужно будет передать из useTodoStore
          />
        ))}
      </ul>

      {userTodos.length > 0 && (
        <div className={styles.footer}>
          <span className={styles.todoCount}>
            <strong>{activeTodosCount}</strong> {activeTodosCount === 1 ? 'активная задача' : 'активных задач'} 
          </span>
          {completedTodosCount > 0 && (
            <button 
              onClick={clearCompletedTodos} 
              className={styles.clearButton}
            >
              Очистить завершенные ({completedTodosCount})
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoList;