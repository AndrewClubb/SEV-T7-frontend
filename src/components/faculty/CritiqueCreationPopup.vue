<template>
  <div>
    <div class="popup">
      <div class="popup-inner">
        <slot> </slot>
        <v-button class="popup-close"> Close </v-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.popup {
  position: fixed;
  top: 0%;
  left: 0%;
  right: 0%;
  bottom: 0%;
  z-index: 99;
  background-color: 0, 0, 0, 0.2;
  display: flex;
  align-items: center;
  justify-content: center;
}
.popup-inner {
  background-color: #fff;
  padding: 32px;
}
</style>
