<script setup>
import { ref } from 'vue'
import CameraView from './components/CameraView.vue'
import PreviewView from './components/PreviewView.vue'

const screen = ref('camera') // 'camera' | 'preview'
const capturedImage = ref(null)

function onCapture(imageBlob) {
  capturedImage.value = imageBlob
  screen.value = 'preview'
}

function onRetake() {
  capturedImage.value = null
  screen.value = 'camera'
}

function onSent() {
  capturedImage.value = null
  screen.value = 'camera'
}
</script>

<template>
  <CameraView v-if="screen === 'camera'" @capture="onCapture" />
  <PreviewView v-else-if="screen === 'preview'" :image="capturedImage" @retake="onRetake" @sent="onSent" />
</template>
