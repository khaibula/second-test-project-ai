import { useState, useEffect } from 'react';
import { Todo as TodoType } from '../../../../shared/types';
import { useTodoStore } from '../../';
import styles from './Todo.module.css';

interface TodoProps {
  todo: TodoType;
}

const Todo = ({ todo }: TodoProps) => {
  const { toggleTodo, removeTodo } = useTodoStore();
  const [isChecked, setIsChecked] = useState(todo.completed);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    setIsChecked(todo.completed);
  }, [todo.completed]);
  
  const handleToggle = () => {
    setIsChecked(!isChecked);
    setIsAnimating(true);
    toggleTodo(todo.id);
    
    // Сбрасываем флаг анимации после завершения
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };
  
  const handleDelete = () => {
    removeTodo(todo.id);
  };
  
  return (
    <div className={styles.todoItem}>
      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          id={`todo-${todo.id}`}
          checked={isChecked}
          onChange={handleToggle}
          className={`${styles.checkbox} ${isAnimating && isChecked ? styles.checkmarkAnimation : ''}`}
          aria-label={`Отметить задачу "${todo.title}" как ${isChecked ? 'невыполненную' : 'выполненную'}`}
        />
      </div>
      
      <label 
        htmlFor={`todo-${todo.id}`}
        className={`${styles.todoText} ${isChecked ? styles.completed : ''}`}
      >
        {todo.title}
      </label>
      
      <button
        onClick={handleDelete}
        className={styles.deleteButton}
        aria-label={`Удалить задачу "${todo.title}"`}
      >
        ✕
      </button>
    </div>
  );
};

export default Todo; 