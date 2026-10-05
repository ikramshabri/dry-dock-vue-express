import { ref } from "vue";

export function useCrud(service, { defaults, params = () => ({}) }) {
  const items = ref([]);
  const form = ref(defaults());
  const editingId = ref(null);
  const error = ref("");

  async function load() {
    try {
      items.value = await service.list(params());
    } catch (e) {
      error.value = e.message;
    }
  }

  function reset() {
    form.value = defaults();
    editingId.value = null;
  }

  function edit(item) {
    form.value = { ...item };
    editingId.value = item.id;
  }

  async function save() {
    error.value = "";
    try {
      if (editingId.value) {
        await service.update(editingId.value, form.value);
      } else {
        await service.create(form.value);
      }
      reset();
      await load();
    } catch (e) {
      error.value = e.message;
    }
  }

  async function remove(id) {
    if (!confirm("Hapus data ini?")) return;
    error.value = "";
    try {
      await service.remove(id);
      await load();
    } catch (e) {
      error.value = e.message;
    }
  }

  return { items, form, editingId, error, load, reset, edit, save, remove };
}
