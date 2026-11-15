export function Logo() {
  return (<><span className="logo">D</span><span className="brand-name">Digitaly</span></>)
}

// Icône produit : image si fournie, sinon initiales colorées
export function Icon({ p }) {
  const initials = p.name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const hue = [...p.name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360
  if (p.image_url) return <img className="icon" src={p.image_url} alt={p.name} />
  return (
    <span className="icon" style={{ background: `hsl(${hue} 45% 14%)`, color: `hsl(${hue} 90% 72%)`, borderColor: `hsl(${hue} 40% 24%)` }}>
      {initials}
    </span>
  )
}

export const fmt = n => new Intl.NumberFormat('fr-FR').format(n)
