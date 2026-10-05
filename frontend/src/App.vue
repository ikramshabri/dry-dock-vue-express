<script setup>
const menus = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/spec-groups', label: 'Specification Groups' },
  { to: '/work-order-masters', label: 'Work Order Master' },
  { to: '/checklists', label: 'Checklist' },
  { to: '/dry-docks', label: 'Dry Docks' },
];

const masters = [
  { to: '/vessels', label: 'Vessels' },
  { to: '/shipyards', label: 'Shipyards' },
];
</script>

<template>
  <div class="layout">
    <aside>
      <div class="brand">Dry Dock</div>
      <router-link v-for="menu in menus" :key="menu.to" :to="menu.to">{{ menu.label }}</router-link>
      <div class="section">Master Data</div>
      <router-link v-for="menu in masters" :key="menu.to" :to="menu.to">{{ menu.label }}</router-link>
    </aside>
    <main>
      <router-view />
    </main>
  </div>
</template>
