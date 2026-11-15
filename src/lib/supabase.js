import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && key ? createClient(url, key) : null
export const TELEGRAM = import.meta.env.VITE_TELEGRAM_USERNAME || 'MON_USERNAME'

// Données de démo affichées tant que Supabase n'est pas configuré
export const DEMO = [
  { id: '1', name: 'Canva Pro', description: 'Crée des designs professionnels avec tous les outils premium.', price: 1800, duration: '12 mois', image_url: '', available: true },
  { id: '2', name: 'ChatGPT Pro', description: 'Accès prioritaire aux modèles avancés et aux outils premium.', price: 4200, duration: '1 mois', image_url: '', available: true },
  { id: '3', name: 'CapCut Pro', description: 'Montage vidéo sans limites, effets et exports haute qualité.', price: 2400, duration: '3 mois', image_url: '', available: true },
  { id: '4', name: 'Gemini Pro', description: "L'assistant IA de Google avec fonctionnalités avancées.", price: 3500, duration: '1 mois', image_url: '', available: false },
  { id: '5', name: 'Adobe Creative Cloud', description: 'Photoshop, Illustrator et les outils créatifs essentiels.', price: 5600, duration: '3 mois', image_url: '', available: true },
  { id: '6', name: 'Netflix Premium', description: 'Films et séries en 4K sur tous tes appareils.', price: 1500, duration: '1 mois', image_url: '', available: true },
]
