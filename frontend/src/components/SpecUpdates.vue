<script setup>
import { reactive, ref } from "vue";
import CrudPage from "./CrudPage.vue";
import { workOrderService, specUpdateService } from "../services";
import { workOrderFields, sheetFields } from "../config/fields";
import { updateRow } from "../config/rows";

defineProps({ dryDockId: { type: String, required: true } });

const selected = ref(null);
const form = reactive({ progress: 0, note: "", updated_by: "" });
const error = ref("");
const refreshKey = ref(0);

function openUpdate(item) {
  selected.value = item;
  form.progress = item.progress ?? 0;
  form.note = "";
  form.updated_by = "";
  error.value = "";
}

async function submit() {
  error.value = "";
  try {
    await specUpdateService.create({
      work_order_id: selected.value.id,
      ...form,
    });
    selected.value = null;
    refreshKey.value++;
  } catch (e) {
    error.value = e.message;
  }
}

async function complete(item) {
  try {
    await workOrderService.patch(item.id, {
      status: "complete",
      progress: 100,
    });
    refreshKey.value++;
  } catch (e) {
    error.value = e.message;
  }
}
</script>

<template>
  <p v-if="error && !selected" class="error">{{ error }}</p>

  <CrudPage
    :key="`list-${refreshKey}`"
    title="Updates"
    item-name="Work Order"
    :service="workOrderService"
    :fields="workOrderFields"
    :fixed="{ dry_dock_id: dryDockId }"
    layout="list"
    :row="updateRow"
    group-by="spec_group_id"
    filter-key="status"
    @changed="refreshKey++"
  >
    <template #actions="{ item }">
      <button @click="openUpdate(item)">Add Specification Update</button>
      <button
        class="light-outline"
        :disabled="item.status === 'complete'"
        @click="complete(item)"
      >
        Complete
      </button>
    </template>
  </CrudPage>

  <CrudPage
    :key="`sheet-${refreshKey}`"
    :service="workOrderService"
    :fields="sheetFields"
    :fixed="{ dry_dock_id: dryDockId }"
    :editable="false"
    numbered
  />

  <div v-if="selected" class="backdrop" @click.self="selected = null">
    <div class="card modal">
      <h2>Specification Update</h2>
      <p>{{ selected.title }}</p>
      <p v-if="error" class="error">{{ error }}</p>
      <form @submit.prevent="submit">
        <label
          >Progress (%)
          <input type="number" min="0" max="100" v-model="form.progress"
        /></label>
        <label>Catatan <input v-model="form.note" /></label>
        <label>Diupdate oleh <input v-model="form.updated_by" /></label>
        <div class="actions">
          <button type="submit">Simpan</button>
          <button type="button" class="secondary" @click="selected = null">
            Batal
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
