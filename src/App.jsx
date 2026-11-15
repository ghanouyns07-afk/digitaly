import { useEffect, useState } from 'react'
import Shop from './components/Shop.jsx'
import Admin from './components/Admin.jsx'
import { Logo } from './components/ui.jsx'

export default function App() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const on = () => { setHash(window.location.hash); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const isAdmin = hash.startsWith('#/admin')

  return (
    <div className="app">
      <div className="glow g1" /><div className="glow g2" />
      <div className="wrap">
        <header className="nav">
          <a href="#/" className="brand"><Logo /></a>
          {isAdmin
            ? <a className="btn ghost sm" href="#/">Voir la boutique</a>
            : <a className="btn ghost sm" href="#/" onClick={e => { e.preventDefault(); document.getElementById('offres')?.scrollIntoView({ behavior: 'smooth' }) }}>Voir les offres</a>}
        </header>
        {isAdmin ? <Admin /> : <Shop />}
        <footer className="foot">
          <div>
            <a href="#/" className="brand"><Logo /></a>
            <p className="muted xs">Les meilleurs abonnements numériques, simplement.</p>
          </div>
          <div className="muted xs foot-r">
            <span>© {new Date().getFullYear()} Digitaly</span>
            <a href="#/admin">Admin</a>
          </div>
        </footer>
      </div>
    </div>
  )
}
