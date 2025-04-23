import { useState, useEffect } from 'react';
import { useAuthStore } from '../../';
import styles from './AuthForm.module.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValid, setFormValid] = useState(false);
  
  const { login, register } = useAuthStore();

  // Проверка валидности формы
  useEffect(() => {
    setFormValid(username.trim().length >= 3 && password.length >= 6);
  }, [username, password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Дополнительная валидация
    if (!username.trim()) {
      setError('Имя пользователя не может быть пустым');
      return;
    }
    
    if (username.trim().length < 3) {
      setError('Имя пользователя должно содержать минимум 3 символа');
      return;
    }
    
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }
    
    setIsSubmitting(true);
    let success;
    
    if (isLogin) {
      success = login(username, password);
      if (!success) {
        setError('Неверное имя пользователя или пароль');
      }
    } else {
      success = register(username, password);
      if (!success) {
        setError('Пользователь с таким именем уже существует');
      }
    }
    
    if (success) {
      setUsername('');
      setPassword('');
    }
    
    setIsSubmitting(false);
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {isLogin ? 'Вход в систему' : 'Регистрация'}
      </h2>
      
      {error && (
        <div className={styles.errorContainer} role="alert">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="username">
            Имя пользователя
          </label>
          <input
            id="username"
            type="text"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Введите имя пользователя"
            autoComplete="username"
            minLength={3}
            required
            aria-describedby={error ? "form-error" : undefined}
          />
          {!isLogin && username && username.length < 3 && (
            <div className={styles.fieldHint}>
              Минимум 3 символа
            </div>
          )}
        </div>
        
        <div className={styles.formGroupLarge}>
          <label className={styles.label} htmlFor="password">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            autoComplete={isLogin ? "current-password" : "new-password"}
            minLength={6}
            required
            aria-describedby={error ? "form-error" : undefined}
          />
          {!isLogin && password && password.length < 6 && (
            <div className={styles.fieldHint}>
              Минимум 6 символов
            </div>
          )}
        </div>
        
        <div className={styles.formActions}>
          <button
            type="submit"
            className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
            disabled={isSubmitting || !formValid}
          >
            {isSubmitting 
              ? 'Подождите...' 
              : isLogin 
                ? 'Войти' 
                : 'Зарегистрироваться'}
          </button>
          
          <button
            type="button"
            className={styles.toggleButton}
            onClick={handleToggleMode}
          >
            {isLogin ? 'Создать аккаунт' : 'Уже есть аккаунт?'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm; 