<template>
  <div class="header">
    <div class="toolbar">header</div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.header {
  display: block;
  position: relative;
  order: -1;
  width: 100%;
  z-index: 10;
}
.toolbar {
  border-width: 0 0 0.55px;
  padding-top: 20px;
  inset: 0px;
  position: absolute;
  transform: translateZ(0px);
  border-width: 0 0 0.55px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.2);
  background: #f7f7f7;
  opacity: calc(1 * 1);
  z-index: -1;
  pointer-events: none;
}
</style>
