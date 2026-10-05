<script setup>
defineEmits(['edit', 'remove']);

function close(event) {
  event.currentTarget.closest('details').removeAttribute('open');
}
</script>

<template>
  <details class="menu">
    <summary>&middot;&middot;&middot;</summary>
    <div class="menu-items">
      <button @click="$emit('edit'); close($event)">Edit</button>
      <button class="danger" @click="$emit('remove'); close($event)">Delete</button>
    </div>
  </details>
</template>
