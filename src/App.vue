<script setup>
import { ref, onMounted } from 'vue'
import CameraView from './components/CameraView.vue'
import PreviewView from './components/PreviewView.vue'
import InstructionPopup from './components/InstructionPopup.vue'
import RecapView from './components/RecapView.vue'
import { useGeolocation } from './composables/useGeolocation.js'

const API_URL = import.meta.env.VITE_API_URL || 'https://lf23-camera-pwa-backend.onrender.com'

const screen = ref('popup') // 'popup' | 'camera' | 'preview' | 'saving' | 'recap'
const capturedImage = ref(null)
const savedRecord = ref(null)
const { latitude, longitude, requestPosition } = useGeolocation()

onMounted(() => {
  requestPosition()
})

function onDismiss() {
  screen.value = 'camera'
}

function onCapture(imageBlob) {
  capturedImage.value = imageBlob
  screen.value = 'preview'
}

function onRetake() {
  capturedImage.value = null
  screen.value = 'camera'
}

async function onSave() {
  screen.value = 'saving'

  try {
    await requestPosition()

    const formData = new FormData()
    formData.append('foto', capturedImage.value, 'campana.jpg')
    if (latitude.value) formData.append('latitudine', latitude.value)
    if (longitude.value) formData.append('longitudine', longitude.value)

    const res = await fetch(`${API_URL}/api/foto`, {
      method: 'POST',
      body: formData
    })

    if (!res.ok) throw new Error('Errore server')

    savedRecord.value = await res.json()
    capturedImage.value = null
    screen.value = 'recap'
  } catch (err) {
    screen.value = 'preview'
  }
}
</script>

<template>
  <InstructionPopup v-if="screen === 'popup'" @dismiss="onDismiss" />

  <CameraView v-if="screen === 'camera'" @capture="onCapture" />

  <PreviewView
    v-if="screen === 'preview' && capturedImage"
    :image="capturedImage"
    @retake="onRetake"
    @save="onSave"
  />

  <div v-if="screen === 'saving'" class="saving-screen">
    <div class="spinner" />
    <p>Salvataggio in corso...</p>
  </div>

  <RecapView
    v-if="screen === 'recap' && savedRecord"
    :giorno="savedRecord.giorno"
    :ora="savedRecord.ora"
    :latitudine="savedRecord.latitudine"
    :longitudine="savedRecord.longitudine"
  />
</template>

<style>
.saving-screen {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: #1a1a2e;
  color: #fff;
  font-size: 18px;
}

.spinner {
  width: 44px;
  height: 44px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
