import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { Icon } from './ui.jsx'

export default function Admin() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    if (!supabase) { setSession(null); return }
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!supabase) return <Notice title="Supabase n'est pas configuré" text="Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans ton fichier .env (voir le README)." />
  if (session === undefined) return <p className="muted pad">Chargement…</p>
  return session ? <Dashboard /> : <Login />
}

function Notice({ title, text }) {
  return <div className="login"><h2>{title}</h2><p className="muted">{text}</p></div>
}

function Login() {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async e => {
    e.preventDefault(); setBusy(true); setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw })
    if (error) setErr('Email ou mot de passe incorrect.')
    setBusy(false)
  }

  return (
    <form className="login" onSubmit={submit}>
      <span className="shield">✓</span>
      <h2>Connexion admin</h2>
      <p className="muted">Connecte-toi pour gérer le catalogue.</p>
      <label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label>Mot de passe<input type="password" required value={pw} onChange={e => setPw(e.target.value)} /></label>
      {err && <p className="err">{err}</p>}
      <button className="btn primary full" disabled={busy}>{busy ? 'Connexion…' : 'Se connecter'}</button>
    </form>
  )
}

function Dashboard() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('')
  const timer = useRef()

  const load = async () => {
    const { data } = await supabase.from('products').select('*').order('position', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  const flash = msg => { setStatus(msg); clearTimeout(timer.current); timer.current = setTimeout(() => setStatus(''), 2000) }
  const local = (id, patch) => setItems(l => l.map(p => p.id === id ? { ...p, ...patch } : p))

  const save = async (id, patch) => {
    local(id, patch)
    const { error } = await supabase.from('products').update(patch).eq('id', id)
    flash(error ? 'Erreur : ' + error.message : 'Enregistré')
  }
  const add = async () => {
    const { error } = await supabase.from('products').insert({ name: 'Nouveau produit', description: 'Ajoute une courte description de cette offre.', price: 1000, duration: '1 mois' })
    flash(error ? 'Erreur : ' + error.message : 'Produit ajouté'); load()
  }
  const del = async p => {
    if (!confirm(`Supprimer « ${p.name} » ?`)) return
    const { error } = await supabase.from('products').delete().eq('id', p.id)
    flash(error ? 'Erreur : ' + error.message : 'Produit supprimé'); load()
  }

  const avail = items.filter(p => p.available).length

  return (
    <main className="pad">
      <div className="dash-head">
        <div>
          <h1 className="h1s">Gestion des produits</h1>
          <p className="muted xs">Modifie ton catalogue. Les changements sont enregistrés quand tu quittes un champ. {status && <b className="saved">{status}</b>}</p>
        </div>
        <div className="row">
          <button className="btn ghost sm" onClick={() => supabase.auth.signOut()}>Déconnexion</button>
          <button className="btn primary sm" onClick={add}>+ Ajouter un produit</button>
        </div>
      </div>

      <div className="stats">
        <div><b>{items.length}</b><span className="muted xs">Produits au total</span></div>
        <div><b>{avail}</b><span className="muted xs">Disponibles</span></div>
        <div><b>{items.length - avail}</b><span className="muted xs">En rupture</span></div>
      </div>

      <h2 className="h2s">Catalogue</h2>
      {items.map(p => (
        <div className="edit" key={p.id}>
          <div className="edit-top">
            <div className="row"><Icon p={p} /><b>{p.name}</b></div>
            <button className="trash" title="Supprimer" onClick={() => del(p)}>🗑</button>
          </div>
          <div className="edit-grid">
            <Field label="Nom du produit" value={p.name} onChange={v => local(p.id, { name: v })} onSave={v => save(p.id, { name: v })} />
            <Field label="Description" area value={p.description} onChange={v => local(p.id, { description: v })} onSave={v => save(p.id, { description: v })} />
            <Field label="Prix (DA)" type="number" value={p.price} onChange={v => local(p.id, { price: v })} onSave={v => save(p.id, { price: Number(v) || 0 })} />
            <Field label="Durée" value={p.duration} onChange={v => local(p.id, { duration: v })} onSave={v => save(p.id, { duration: v })} />
            <Field label="URL de l'image" placeholder="https://…" value={p.image_url} onChange={v => local(p.id, { image_url: v })} onSave={v => save(p.id, { image_url: v })} />
            <label className="fld">Disponibilité
              <button type="button" className={'switch ' + (p.available ? 'on' : '')} onClick={() => save(p.id, { available: !p.available })}>
                <i />{p.available ? 'Disponible' : 'Rupture'}
              </button>
            </label>
          </div>
        </div>
      ))}
    </main>
  )
}

function Field({ label, value, onChange, onSave, area, ...rest }) {
  const Tag = area ? 'textarea' : 'input'
  return (
    <label className={'fld' + (area ? ' span' : '')}>{label}
      <Tag {...rest} value={value} onChange={e => onChange(e.target.value)} onBlur={e => onSave(e.target.value)} />
    </label>
  )
}
