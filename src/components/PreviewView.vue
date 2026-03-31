<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { analyzeImage } from '../api.js'

const props = defineProps({
  image: { type: Blob, required: true }
})

const emit = defineEmits(['retake', 'result'])

const loading = ref(false)
const error = ref(null)
const imageUrl = computed(() => URL.createObjectURL(props.image))

onUnmounted(() => {
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
})

function saveToDevice() {
  const link = document.createElement('a')
  link.href = imageUrl.value
  link.download = `campana_${Date.now()}.jpg`
  link.click()
}

async function send() {
  loading.value = true
  error.value = null
  try {
    saveToDevice()
    const data = await analyzeImage(props.image)
    emit('result', data)
  } catch (err) {
    error.value = 'Errore durante l\'invio. Riprova.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="preview-view">
    <img :src="imageUrl" alt="Foto scattata" class="preview-image" />

    <div class="preview-overlay">
      <p v-if="error" class="error-msg">{{ error }}</p>

      <div v-if="loading" class="loading">
        <div class="spinner" />
        <p>Analisi in corso...</p>
      </div>

      <div v-else class="actions">
        <button class="btn btn-retake" @click="$emit('retake')">Ripeti</button>
        <button class="btn btn-send" @click="send">Invia</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-view {
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.preview-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 24px 48px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.actions {
  display: flex;
  gap: 16px;
  width: 100%;
  max-width: 360px;
}

.btn {
  flex: 1;
  padding: 18px 24px;
  border-radius: 14px;
  font-size: 18px;
  font-weight: 600;
}

.btn-retake {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.btn-retake:active {
  background: rgba(255, 255, 255, 0.3);
}

.btn-send {
  background: #4ade80;
  color: #1a1a2e;
}

.btn-send:active {
  background: #22c55e;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-size: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-msg {
  color: #ff6b6b;
  font-size: 14px;
  text-align: center;
}
</style>
