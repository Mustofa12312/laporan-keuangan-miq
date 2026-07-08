import { createContext, useContext, useEffect, useState } from 'react'
import { STORAGE_KEYS } from '../constants'

const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.THEME) || 'system'
  )

  useEffect(() => {
    const root = document.documentElement
    const applyDark = () => root.classList.add('dark')
    const applyLight = () => root.classList.remove('dark')

    if (theme === 'dark')  { applyDark(); return }
    if (theme === 'light') { applyLight(); return }

    // system
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.matches ? applyDark() : applyLight()
    const handler = (e) => e.matches ? applyDark() : applyLight()
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const changeTheme = (t) => {
    setTheme(t)
    localStorage.setItem(STORAGE_KEYS.THEME, t)
  }

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
