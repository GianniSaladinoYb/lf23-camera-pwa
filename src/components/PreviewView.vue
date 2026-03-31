<script setup>
import { ref, computed, onUnmounted } from 'vue'

const props = defineProps({
  image: { type: Blob, required: true }
})

const emit = defineEmits(['retake', 'sent'])

const error = ref(null)
const imageUrl = computed(() => URL.createObjectURL(props.image))

onUnmounted(() => {
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
})

async function send() {
  error.value = null
  try {
    const file = new File([props.image], `campana_${Date.now()}.jpg`, { type: 'image/jpeg' })

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'CampanaCheck'
      })
    } else {
      const link = document.createElement('a')
      link.href = imageUrl.value
      link.download = file.name
      link.click()
    }

    emit('sent')
  } catch (err) {
    if (err.name !== 'AbortError') {
      error.value = 'Errore durante il salvataggio. Riprova.'
    }
  }
}
</script>

<template>
  <div class="preview-view">
    <img :src="imageUrl" alt="Foto scattata" class="preview-image" />

    <div class="preview-overlay">
      <p v-if="error" class="error-msg">{{ error }}</p>

      <div class="actions">
        <button class="btn btn-retake" @click="$emit('retake')">Ripeti</button>
        <button class="btn btn-send" @click="send">Salva</button>
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

.error-msg {
  color: #ff6b6b;
  font-size: 14px;
  text-align: center;
}
</style>
