import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import pg from 'pg'

const app = express()
const upload = multer({ storage: multer.memoryStorage() })

app.use(cors())
app.use(express.json())

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
})

// POST /api/foto - salva foto con coordinate
app.post('/api/foto', upload.single('foto'), async (req, res) => {
  try {
    const { latitudine, longitudine } = req.body
    const foto = req.file?.buffer

    if (!foto) {
      return res.status(400).json({ error: 'Foto mancante' })
    }

    const now = new Date()
    const itDate = now.toLocaleDateString('it-IT', { timeZone: 'Europe/Rome' })
    const parts = itDate.split('/')
    const giorno = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
    const ora = now.toLocaleTimeString('it-IT', { timeZone: 'Europe/Rome', hour12: false })

    const result = await pool.query(
      'INSERT INTO "APP_MOBILE_foto_campane" (giorno, ora, latitudine, longitudine, foto) VALUES ($1, $2, $3, $4, $5) RETURNING id, giorno, ora, latitudine, longitudine',
      [giorno, ora, latitudine || null, longitudine || null, foto]
    )

    res.json(result.rows[0])
  } catch (err) {
    console.error('Errore salvataggio:', err)
    res.status(500).json({ error: 'Errore durante il salvataggio' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server attivo su http://localhost:${PORT}`)
})
