# CampanaCheck PWA

PWA per la guida allo scatto e salvataggio foto delle campane di abiti usati con coordinate GPS.

## Architettura

Il progetto e' composto da due parti:

- **Frontend** (Vue 3 + Vite) — la PWA che gira nel browser dell'operatore
- **Backend** (Node.js + Express) — il server API che riceve le foto e le salva su PostgreSQL

## Requisiti

- **Node.js** v18 o superiore
- **PostgreSQL** installato e attivo
- **npm** (incluso con Node.js)

## Setup iniziale (solo la prima volta)

### 1. Clona il repository

```bash
git clone https://github.com/GianniSaladinoYb/lf23-camera-pwa.git
cd lf23-camera-pwa
```

### 2. Installa le dipendenze

```bash
npm install
```

### 3. Crea il database PostgreSQL

Apri il terminale e accedi a PostgreSQL:

```bash
psql -U postgres
```

Inserisci la password quando richiesto, poi esegui:

```sql
CREATE DATABASE campanacheck;
\c campanacheck
CREATE TABLE fotos (
  id SERIAL PRIMARY KEY,
  giorno DATE NOT NULL,
  ora TIME NOT NULL,
  latitudine DOUBLE PRECISION,
  longitudine DOUBLE PRECISION,
  foto BYTEA NOT NULL
);
\q
```

### 4. Configura la connessione al database

Se il tuo utente/password PostgreSQL sono diversi, modifica il file `server/index.js`:

```js
const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  database: 'campanacheck',
  user: 'postgres',
  password: 'LA_TUA_PASSWORD'
})
```

## Avvio del progetto

Servono **due terminali** aperti nella cartella del progetto.

### Terminale 1 — Backend (server API)

```bash
npm run server
```

Vedrai: `Server attivo su http://localhost:3001`

### Terminale 2 — Frontend (app Vue)

```bash
npm run dev
```

Vedrai: `Local: http://localhost:5173/`

### Accesso da browser

- **Da computer**: apri `http://localhost:5173`
- **Da telefono** (stessa rete WiFi): apri `http://[IP-DEL-TUO-MAC]:5173`
  - Per trovare l'IP del Mac: Preferenze di Sistema → Rete → L'IP e' sotto "Stato"

> **Nota**: la fotocamera richiede HTTPS. Da localhost funziona, da rete locale potrebbe servire un'eccezione nel browser (vedi sezione Troubleshooting).

## Flusso dell'app

1. Si apre un popup: "Scatta la foto alla campana"
2. L'operatore preme OK → si attiva la fotocamera con mirino guida
3. Scatta la foto → vede la preview
4. Preme "Ripeti" per scattare di nuovo, oppure "Salva" per confermare
5. La foto viene salvata nel database con data, ora e coordinate GPS
6. Appare una schermata di recap con conferma e tasto "Chiudi"

## Visualizzare i dati salvati

Usa **DBeaver** o qualsiasi client PostgreSQL:

- Host: `localhost`
- Porta: `5432`
- Database: `campanacheck`
- Utente: `postgres`
- Password: la tua password PostgreSQL

La tabella `fotos` contiene tutti i record salvati.

## Struttura del progetto

```
lf23-camera-pwa/
├── server/
│   └── index.js              # Backend Express (API + PostgreSQL)
├── src/
│   ├── App.vue               # Orchestratore flusso app
│   ├── main.js               # Bootstrap Vue + Service Worker
│   ├── config.js             # Configurazione (qualita JPEG, max size)
│   ├── style.css             # CSS globale
│   ├── composables/
│   │   └── useGeolocation.js # Gestione coordinate GPS
│   └── components/
│       ├── CameraView.vue    # Fotocamera + mirino overlay
│       ├── PreviewView.vue   # Preview foto + Ripeti/Salva
│       ├── InstructionPopup.vue  # Popup iniziale
│       └── RecapView.vue     # Schermata conferma salvataggio
├── public/
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service Worker
├── package.json
└── vite.config.js
```

## Troubleshooting

### La fotocamera non si attiva da telefono
La fotocamera richiede HTTPS. Su Chrome Android vai su `chrome://flags`, cerca "Insecure origins treated as secure" e aggiungi l'URL del tuo Mac (es. `http://192.168.1.41:5173`).

### Il salvataggio fallisce
Verifica che il backend sia attivo (`npm run server`) e che PostgreSQL sia in esecuzione (`pg_isready`).

### window.close() non chiude l'app
E' una limitazione dei browser: non permettono di chiudere finestre non aperte da JavaScript. L'operatore puo' chiudere manualmente il tab.
