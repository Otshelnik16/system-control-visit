import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../ui/logo/logo';
import { Title } from '../../ui/title/title';
import { Input } from '../../ui/input/input';
import { Button } from '../../ui/button/button';
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
      navigate('/student');
    } else if (login === 'teacher') {
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