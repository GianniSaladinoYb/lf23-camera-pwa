<script setup>
import { computed, onUnmounted } from 'vue'

const props = defineProps({
  image: { type: Blob, required: true }
})

defineEmits(['retake', 'save'])

const imageUrl = computed(() => URL.createObjectURL(props.image))

onUnmounted(() => {
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
})
</script>

<template>
  <div class="preview-view">
    <img :src="imageUrl" alt="Foto scattata" class="preview-image" />

    <div class="preview-overlay">
      <div class="actions">
        <button class="btn btn-retake" @click="$emit('retake')">Ripeti</button>
        <button class="btn btn-save" @click="$emit('save')">Salva</button>
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

.btn-save {
  background: #4ade80;
  color: #1a1a2e;
}

.btn-save:active {
  background: #22c55e;
}
</style>
