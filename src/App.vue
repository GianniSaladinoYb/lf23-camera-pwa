<script setup>
import { ref } from 'vue'
import CameraView from './components/CameraView.vue'
import PreviewView from './components/PreviewView.vue'
import ResultView from './components/ResultView.vue'

const screen = ref('camera') // 'camera' | 'preview' | 'result'
const capturedImage = ref(null)
const result = ref(null)

function onCapture(imageBlob) {
  capturedImage.value = imageBlob
  screen.value = 'preview'
}

function onRetake() {
  capturedImage.value = null
  result.value = null
  screen.value = 'camera'
}

function onResult(data) {
  result.value = data
  screen.value = 'result'
}

function onNewPhoto() {
  capturedImage.value = null
  result.value = null
  screen.value = 'camera'
}
</script>

<template>
  <CameraView v-if="screen === 'camera'" @capture="onCapture" />
  <PreviewView v-else-if="screen === 'preview'" :image="capturedImage" @retake="onRetake" @result="onResult" />
  <ResultView v-else-if="screen === 'result'" :result="result" @new-photo="onNewPhoto" />
</template>
