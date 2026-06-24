import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../../api/services';
import { setAuth } from '../../../utils/auth';
import { Logo } from '../../ui/logo/logo';
import { Title } from '../../ui/title/title';
import { Input } from '../../ui/input/input';
import { Button } from '../../ui/mainButton/button';
import styles from './login.module.scss';

export const Login = () => {
  const [login, setLogin] = useState('student1');
  const [password, setPassword] = useState('student123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await loginUser(login, password);

      if (!user) {
        setError('Неверный логин или пароль');
        return;
      }

      const token = crypto.randomUUID();
      setAuth(user, token);
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