<script setup>
import { computed, nextTick, onMounted, provide, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { dryDockService } from "../services";

const props = defineProps({ id: { type: String, required: true } });

const route = useRoute();
const router = useRouter();

const dock = ref(null);
const error = ref("");
const toast = ref("");
const activeSection = ref("general");

const tabs = [
  { label: "General", section: "general" },
  { label: "Specifications", section: "specifications" },
  { label: "Tasks", page: "tasks" },
  { label: "Sourcing", page: "sourcing" },
  { label: "Execution", page: "execution" },
  { label: "Reporting", page: "reporting" },
  { label: "Costs", page: "costs" },
  { label: "Purchase Orders", page: "purchase-orders" },
];

const isGeneral = computed(() => route.name === "dry-dock-general");

async function reloadDock() {
  try {
    dock.value = await dryDockService.get(props.id);
  } catch (e) {
    error.value = e.message;
  }
}

provide("dock", dock);
provide("reloadDock", reloadDock);

function notify(message) {
  toast.value = message;
  setTimeout(() => (toast.value = ""), 1500);
}

async function open(tab) {
  if (!tab.section) {
    await router.push({
      name: `dry-dock-${tab.page}`,
      params: { id: props.id },
    });
    return;
  }

  activeSection.value = tab.section;
  document.getElementById(tab.section)?.scrollIntoView({ behavior: "smooth" });
  notify("Success");
}

onMounted(reloadDock);
</script>

<template>
  <div v-if="dock">
    <div v-if="isGeneral" class="topbar">
      <div class="breadcrumb">
        <router-link to="/dry-docks">&lsaquo; Dry Docks</router-link>
        <span>/</span>
        <strong>{{ dock.dry_dock_no }}</strong>
      </div>
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.label"
          :class="{ active: tab.section === activeSection }"
          @click="open(tab)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div v-else class="backbar">
      <router-link :to="{ name: 'dry-dock-general', params: { id } }">
        <button>Back</button>
      </router-link>
    </div>

    <router-view :id="id" />

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
  <p v-else-if="error" class="error">{{ error }}</p>
</template>
