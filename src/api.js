import { API_ENDPOINT } from './config.js'

/**
 * Mock della risposta backend con delay simulato 1-2s.
 * Da sostituire con la vera chiamata API quando il backend sara' pronto.
 */
function mockAnalyze() {
  return new Promise((resolve) => {
    const delay = 1000 + Math.random() * 1000
    const fill = Math.floor(Math.random() * 100)
    let status = 'vuota'
    if (fill >= 30 && fill <= 70) status = 'parziale'
    else if (fill > 70) status = 'piena'

    setTimeout(() => {
      resolve({
        fill_percentage: fill,
        status,
        confidence: +(0.7 + Math.random() * 0.25).toFixed(2),
        analysis_id: crypto.randomUUID()
      })
    }, delay)
  })
}

export async function analyzeImage(imageBlob) {
  const USE_MOCK = true // Cambiare a false quando il backend e' pronto

  if (USE_MOCK) {
    return mockAnalyze()
  }

  const formData = new FormData()
  formData.append('image', imageBlob, 'campana.jpg')
  formData.append('timestamp', new Date().toISOString())

  // Geolocalizzazione opzionale
  try {
    const pos = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 })
    )
    formData.append('location', JSON.stringify({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    }))
  } catch {
    // Geolocalizzazione non disponibile, proseguiamo senza
  }

  const res = await fetch(API_ENDPOINT, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) throw new Error(`Errore server: ${res.status}`)
  return res.json()
}
