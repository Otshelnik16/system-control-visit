import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../ui/logo/logo.tsx';
import { Title } from '../../ui/title/title.tsx';
import { Input } from '../../ui/input/input.tsx';
import { Button } from '../../ui/button/button.tsx';
import styles from './login.module.scss';

export const Login = () => {
  const [login, setLogin] = useState('student');
  const [password, setPassword] = useState('**********');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Логин:', login);
    console.log('Пароль:', password);

    if (login === 'student') {
      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('role', 'student');
      navigate('/student');
    } else if (login === 'teacher') {
      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('role', 'teacher');
      navigate('/teacher');
    } else {
      alert('Неверный логин или пароль');
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
          <Button type="submit">Войти</Button>
        </form>
      </div>
    </div>
  );
};