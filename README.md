# Digitaly – boutique d'abonnements (React + Supabase)

Site client (catalogue + commande sur Telegram) et espace admin (`/#/admin`) pour gérer produits, prix et disponibilité.

## Structure
```
digitaly/
├── index.html
├── package.json
├── vite.config.js
├── .env.example          ← à copier en .env
├── supabase/schema.sql   ← table products + sécurité + données d'exemple
└── src/
    ├── main.jsx
    ├── App.jsx           ← header, footer, routage (#/ et #/admin)
    ├── styles.css
    ├── lib/supabase.js   ← connexion BDD + username Telegram
    └── components/
        ├── Shop.jsx      ← page client
        ├── Admin.jsx     ← connexion + gestion des produits
        └── ui.jsx        ← logo, icône produit
```

## 1. Base de données gratuite (Supabase)
1. Crée un compte sur supabase.com → **New project** (plan Free).
2. **SQL Editor** → colle le contenu de `supabase/schema.sql` → **Run**.
3. **Authentication → Users → Add user** : ton email + mot de passe (c'est ton accès admin).
4. **Authentication → Sign In / Providers → Email** : désactive **Allow new users to sign up** (sinon n'importe qui pourrait créer un compte).
5. **Project Settings → API** : copie **Project URL** et la clé **anon public**.

## 2. Lancer en local
```bash
npm install
cp .env.example .env     # puis remplis les 3 valeurs
npm run dev
```

## 3. Déployer gratuitement (Vercel)
1. Mets le projet sur GitHub (nouveau repo, `git push`).
2. vercel.com → **Add New → Project** → importe le repo (Vite est détecté automatiquement).
3. **Environment Variables** : ajoute `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_TELEGRAM_USERNAME` (sans le @).
4. **Deploy**. Tu obtiens un lien `xxx.vercel.app`. Chaque `git push` redéploie.

Alternatives gratuites : Netlify ou Cloudflare Pages (même principe : build `npm run build`, dossier `dist`, mêmes 3 variables).

## Notes
- La clé `anon` est publique par design : la sécurité vient des règles RLS dans `schema.sql` (lecture pour tous, écriture seulement pour l'utilisateur connecté).
- Sans `.env`, le site affiche des produits de démo.
- Le plan gratuit Supabase met un projet en pause après ~1 semaine sans activité : il se réactive en un clic.
