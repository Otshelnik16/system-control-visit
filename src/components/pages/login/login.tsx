import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUser, generateToken } from '../../../services/authService';
import { setAuth } from '../../../utils/auth';
import { Logo } from '../../ui/logo/logo';
import { Title } from '../../ui/title/title';
import { Input } from '../../ui/input/input';
import { Button } from '../../ui/mainButton/button.tsx';
import styles from './login.module.scss';

export const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await authenticateUser(login, password);

      if (!user) {
        setError('Неверный логин или пароль');
        return;
      }

      setAuth(user, generateToken());
      navigate(user.role === 'student' ? '/student' : '/teacher');
    } catch {
      setError('Не удалось подключиться к серверу. Запустите npm run dev');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <Logo />
        <Title />
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <Input
            label="Логин"
            placeholder="Введите логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <Input
            label="Пароль"
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className={styles.error}>{error}</div>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Загрузка...' : 'Войти'}
          </Button>
        </form>
      </div>
    </div>
  );
};