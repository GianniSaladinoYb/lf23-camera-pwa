<script setup>
defineProps({
  giorno: { type: String, required: true },
  ora: { type: String, required: true },
  latitudine: { type: Number, default: null },
  longitudine: { type: Number, default: null }
})

defineEmits(['new-scan'])
</script>

<template>
  <div class="recap-view">
    <div class="recap-card">
      <div class="success-icon">&#10003;</div>
      <h1 class="recap-title">Foto Salvata</h1>

      <div class="details">
        <div class="detail-row">
          <span class="detail-label">Giorno</span>
          <span class="detail-value">{{ giorno }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Ora</span>
          <span class="detail-value">{{ ora }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Coordinate</span>
          <span class="detail-value" v-if="latitudine && longitudine">
            {{ latitudine.toFixed(5) }}, {{ longitudine.toFixed(5) }}
          </span>
          <span class="detail-value detail-na" v-else>Non disponibili</span>
        </div>
      </div>

      <button class="btn-new-scan" @click="$emit('new-scan')">Scansiona nuova campana</button>
    </div>
  </div>
</template>

<style scoped>
.recap-view {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #1a1a2e;
}

.recap-card {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.success-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #4ade80;
  color: #1a1a2e;
  font-size: 36px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recap-title {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
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
  padding: 14px 16px;
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

.detail-na {
  color: rgba(255, 255, 255, 0.3);
}

.btn-new-scan {
  margin-top: 12px;
  width: 100%;
  padding: 18px;
  border-radius: 14px;
  background: #4ade80;
  color: #1a1a2e;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

.btn-new-scan:active {
  background: #22c55e;
}
</style>
