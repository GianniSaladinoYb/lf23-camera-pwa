<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { JPEG_QUALITY, MAX_IMAGE_SIZE } from '../config.js'

const emit = defineEmits(['capture'])

const videoRef = ref(null)
const canvasRef = ref(null)
const stream = ref(null)
const cameraError = ref(null)

async function startCamera() {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: false
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
    }
  } catch (err) {
    cameraError.value = 'Impossibile accedere alla fotocamera. Verifica i permessi.'
  }
}

function stopCamera() {
  if (stream.value) {
    stream.value.getTracks().forEach((t) => t.stop())
    stream.value = null
  }
}

function capture() {
  const video = videoRef.value
  const canvas = canvasRef.value
  if (!video || !canvas) return

  // Calcola dimensioni rispettando MAX_IMAGE_SIZE sul lato lungo
  let w = video.videoWidth
  let h = video.videoHeight
  if (Math.max(w, h) > MAX_IMAGE_SIZE) {
    const scale = MAX_IMAGE_SIZE / Math.max(w, h)
    w = Math.round(w * scale)
    h = Math.round(h * scale)
  }

  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.drawImage(video, 0, 0, w, h)

  canvas.toBlob(
    (blob) => {
      if (blob) emit('capture', blob)
    },
    'image/jpeg',
    JPEG_QUALITY
  )
}

onMounted(startCamera)
onUnmounted(stopCamera)
</script>

<template>
  <div class="camera-view">
    <!-- Errore camera -->
    <div v-if="cameraError" class="camera-error">
      <p>{{ cameraError }}</p>
    </div>

    <!-- Feed video -->
    <video
      v-show="!cameraError"
      ref="videoRef"
      autoplay
      playsinline
      muted
      class="camera-feed"
    />

    <!-- Overlay mirino -->
    <div v-if="!cameraError" class="overlay">
      <div class="overlay-mask">
        <div class="guide-shape">
          <div class="corner top-left" />
          <div class="corner top-right" />
          <div class="corner bottom-left" />
          <div class="corner bottom-right" />
        </div>
      </div>
      <p class="guide-text">Centra la campana all'interno della sagoma</p>
    </div>

    <!-- Pulsante scatto -->
    <div v-if="!cameraError" class="controls">
      <button class="shutter-btn" @click="capture" aria-label="Scatta foto">
        <span class="shutter-inner" />
      </button>
    </div>

    <!-- Canvas nascosto per cattura -->
    <canvas ref="canvasRef" style="display: none" />
  </div>
</template>

<style scoped>
.camera-view {
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  overflow: hidden;
}

.camera-feed {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 32px;
  text-align: center;
  font-size: 18px;
  color: #ff6b6b;
}

/* Overlay mirino */
.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}

.overlay-mask {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 24px;
}

.guide-shape {
  position: relative;
  width: 85%;
  max-width: 340px;
  aspect-ratio: 3 / 4;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
}

/* Angoli mirino */
.corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border-color: #fff;
  border-style: solid;
  border-width: 0;
}

.corner.top-left {
  top: -2px;
  left: -2px;
  border-top-width: 4px;
  border-left-width: 4px;
  border-top-left-radius: 20px;
}

.corner.top-right {
  top: -2px;
  right: -2px;
  border-top-width: 4px;
  border-right-width: 4px;
  border-top-right-radius: 20px;
}

.corner.bottom-left {
  bottom: -2px;
  left: -2px;
  border-bottom-width: 4px;
  border-left-width: 4px;
  border-bottom-left-radius: 20px;
}

.corner.bottom-right {
  bottom: -2px;
  right: -2px;
  border-bottom-width: 4px;
  border-right-width: 4px;
  border-bottom-right-radius: 20px;
}

.guide-text {
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  color: #fff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
}

/* Controlli scatto */
.controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 24px 0 40px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
}

.shutter-btn {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  pointer-events: auto;
}

.shutter-btn:active {
  transform: scale(0.92);
}

.shutter-inner {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #fff;
  display: block;
}
</style>
