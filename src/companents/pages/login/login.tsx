import { useState } from 'react'
import iconImg from '../../../assets/icone.png' 
import styles from './login.module.scss'

export const Login = () => {
  const [login, setLogin] = useState('student')
  const [password, setPassword] = useState('**********')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Логин:', login)
    console.log('Пароль:', password)
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <img src={iconImg} alt="Логотип" className={styles.loginIcon} />
        
        <h1 className={styles.loginTitle}>Контроль посещаемости</h1>
        <p className={styles.loginDescription}>
          Войдите в систему для отметки или просмотра таблеток
        </p>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="login">Логин</label>
            <input
              type="text"
              id="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Введите логин"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
            />
          </div>

          <button type="submit" className={styles.loginBtn}>
            Войти
          </button>
        </form>
      </div>
    </div>
  )
}