import { ref } from 'vue'

export function useGeolocation() {
  const latitude = ref(null)
  const longitude = ref(null)
  const error = ref(null)

  function requestPosition() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        error.value = 'Geolocalizzazione non supportata'
        resolve()
        return
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          latitude.value = pos.coords.latitude
          longitude.value = pos.coords.longitude
          error.value = null
          resolve()
        },
        (err) => {
          error.value = 'Posizione non disponibile'
          resolve()
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      )
    })
  }

  return { latitude, longitude, error, requestPosition }
}
