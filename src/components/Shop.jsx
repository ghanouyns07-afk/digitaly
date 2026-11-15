import { useEffect, useState } from 'react'
import { supabase, DEMO, TELEGRAM } from '../lib/supabase.js'
import { Icon, fmt } from './ui.jsx'

const orderLink = p => {
  const msg = `Bonjour, je veux commander : ${p.name} (${fmt(p.price)} DA, ${p.duration})`
  return `https://t.me/${TELEGRAM}?text=${encodeURIComponent(msg)}`
}

export default function Shop() {
  const [items, setItems] = useState(null)

  useEffect(() => {
    if (!supabase) { setItems(DEMO); return }
    supabase.from('products').select('*').order('position').then(({ data }) => setItems(data || []))
  }, [])

  const count = (items || []).filter(p => p.available).length

  return (
    <main>
      <section className="hero">
        <span className="pill"><i className="dot cyan" />Simple, rapide et sécurisé</span>
        <h1>Tous tes abonnements numériques <em>en un seul endroit</em></h1>
        <p className="muted">Choisis ton abonnement, commande en un clic et reçois tes accès rapidement via Telegram.</p>
        <a className="btn primary" href="#offres" onClick={e => { e.preventDefault(); document.getElementById('offres')?.scrollIntoView({ behavior: 'smooth' }) }}>Voir les offres</a>
      </section>

      <section id="offres" className="offers">
        <div className="offers-head">
          <h2>Choisis ton offre</h2>
          <span className="muted xs">{count} offre{count > 1 ? 's' : ''} disponible{count > 1 ? 's' : ''}</span>
        </div>
        {items === null && <p className="muted">Chargement…</p>}
        {items && items.length === 0 && <p className="muted">Aucune offre pour le moment.</p>}
        <div className="grid">
          {(items || []).map(p => (
            <article className="card" key={p.id}>
              <div className="card-top">
                <Icon p={p} />
                <span className={'badge ' + (p.available ? 'ok' : 'off')}><i className="dot" />{p.available ? 'Disponible' : 'Rupture'}</span>
              </div>
              <h3>{p.name}</h3>
              <p className="muted desc">{p.description}</p>
              <div className="price-row">
                <div><strong className="price">{fmt(p.price)} DA</strong><div className="muted xxs">Prix total</div></div>
                <span className="muted xs dur">{p.duration}</span>
              </div>
              {p.available
                ? <a className="btn tg" href={orderLink(p)} target="_blank" rel="noreferrer">Commander sur Telegram</a>
                : <span className="btn disabled">Indisponible</span>}
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
