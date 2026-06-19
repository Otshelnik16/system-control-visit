import { useState } from 'react'
import iconImg from './assets/icone.png'
import './App.css'

function App() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Логин:', login)
    console.log('Пароль:', password)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={iconImg} alt="Логотип" className="login-icon" />
        
        <h1 className="login-title">Контроль посещаемости</h1>
        <p className="login-description">
          Войдите в систему для отметки или просмотра таблеток
        </p>

        {/* ТЕГИ УДАЛЕНЫ! */}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="login">Логин</label>
            <input
              type="text"
              id="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Введите логин"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
            />
          </div>

          <button type="submit" className="login-btn">
            Войти
          </button>
        </form>
      </div>
    </div>
  )
}

export default App