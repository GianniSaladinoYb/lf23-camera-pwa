<script setup>
import { computed } from 'vue'

const props = defineProps({
  result: { type: Object, required: true }
})

defineEmits(['new-photo'])

const level = computed(() => {
  const p = props.result.fill_percentage
  if (p < 30) return { label: 'Vuota', color: '#4ade80' }
  if (p <= 70) return { label: 'Parziale', color: '#facc15' }
  return { label: 'Piena', color: '#ef4444' }
})
</script>

<template>
  <div class="result-view">
    <div class="result-card">
      <h1 class="result-title">Risultato Analisi</h1>

      <div class="percentage" :style="{ color: level.color }">
        {{ result.fill_percentage }}%
      </div>

      <div class="status-badge" :style="{ background: level.color }">
        {{ level.label }}
      </div>

      <div class="details">
        <div class="detail-row">
          <span class="detail-label">Stato</span>
          <span class="detail-value">{{ result.status }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Confidenza</span>
          <span class="detail-value">{{ Math.round(result.confidence * 100) }}%</span>
        </div>
      </div>

      <button class="btn-new-photo" @click="$emit('new-photo')">Nuova foto</button>
    </div>
  </div>
</template>

<style scoped>
.result-view {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #1a1a2e;
}

.result-card {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.result-title {
  font-size: 20px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.percentage {
  font-size: 80px;
  font-weight: 800;
  line-height: 1;
}

.status-badge {
  padding: 8px 28px;
  border-radius: 40px;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.details {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  font-size: 16px;
}

.detail-label {
  color: rgba(255, 255, 255, 0.5);
}

.detail-value {
  color: #fff;
  font-weight: 600;
}

.btn-new-photo {
  margin-top: 12px;
  width: 100%;
  padding: 18px;
  border-radius: 14px;
  background: #fff;
  color: #1a1a2e;
  font-size: 18px;
  font-weight: 600;
}

.btn-new-photo:active {
  background: #e5e5e5;
}
</style>
