<script setup>
defineEmits(['dismiss'])
</script>

<template>
  <div class="popup-overlay" @click="$emit('dismiss')">
    <div class="popup-card" @click.stop>
      <p class="popup-text">Scatta la foto alla campana</p>
      <button class="popup-btn" @click="$emit('dismiss')">OK</button>
    </div>
  </div>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  inset: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.popup-card {
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 40px 32px;
  text-align: center;
  max-width: 320px;
  width: 100%;
}

.popup-text {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 28px;
  line-height: 1.3;
}

.popup-btn {
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  background: #4ade80;
  color: #1a1a2e;
  font-size: 18px;
  font-weight: 700;
}

.popup-btn:active {
  background: #22c55e;
}
</style>
