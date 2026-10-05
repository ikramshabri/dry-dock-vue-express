<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useCrud } from "../composables/useCrud";
import { formatDate } from "../utils/format";
import RowMenu from "./RowMenu.vue";
import StatusBadge from "./StatusBadge.vue";

const props = defineProps({
  title: { type: String, default: "" },
  itemName: { type: String, default: "" },
  service: { type: Object, required: true },
  fields: { type: Array, required: true },
  fixed: { type: Object, default: () => ({}) },
  groupBy: { type: String, default: null },
  editable: { type: Boolean, default: true },
  layout: { type: String, default: "table" }, // table | list | details
  row: { type: Object, default: () => ({}) }, // dipakai layout list
  addLabel: { type: String, default: "Add" },
  headingTag: { type: String, default: "h1" },
  filterKey: { type: String, default: null },
  numbered: { type: Boolean, default: false },
  tableColumns: { type: Array, default: null }, // kolom tabel khusus, selain dari fields
  rowTo: { type: Function, default: null }, // tujuan navigasi saat baris diklik
  hideHeader: { type: Boolean, default: false },
  sortOrder: { type: String, default: null },
});

const emit = defineEmits(["changed"]);

const lookups = reactive({});
const search = ref("");
const filter = ref("");
const formOpen = ref(false);

const defaults = () => {
  const blank = {};
  for (const field of props.fields) {
    blank[field.key] =
      field.type === "checkbox" || field.type === "number" ? 0 : "";
  }
  return { ...blank, ...props.fixed };
};

const { items, form, editingId, error, load, reset, edit, save, remove } =
  useCrud(props.service, {
    defaults,
    params: () => props.fixed,
  });

const name = computed(() => props.itemName || props.title);
const router = useRouter();

const columns = computed(
  () =>
    props.tableColumns ??
    props.fields.filter(
      (field) => field.table !== false && field.key !== props.groupBy,
    ),
);
const searchable = computed(() => [
  ...props.fields,
  ...(props.tableColumns ?? []),
]);
const filterField = computed(() =>
  props.fields.find((f) => f.key === props.filterKey),
);

const humanize = (value) => String(value).replace(/_/g, " ");

function optionsOf(field) {
  if (field.options)
    return field.options.map((o) => ({ value: o, label: humanize(o) }));
  return lookups[field.key] ?? [];
}

function display(item, field) {
  if (field.format) return field.format(item);
  const value = item[field.key];
  if (field.type === "select") {
    const option = optionsOf(field).find((o) => o.value === value);
    return option ? option.label : "";
  }
  if (field.type === "checkbox") return value ? "Yes" : "No";
  if (field.type === "date") return formatDate(value);
  if (field.suffix && value != null) return `${value}${field.suffix}`;
  return value ?? "";
}

const visible = computed(() => {
  const query = search.value.trim().toLowerCase();
  const rows = items.value.filter(
    (item) =>
      (!filter.value || item[props.filterKey] === filter.value) &&
      (!query ||
        searchable.value.some((f) =>
          String(display(item, f)).toLowerCase().includes(query),
        )),
  );

  if (!props.sortOrder) return rows;
  const direction = props.sortOrder === "asc" ? 1 : -1;
  return rows.sort((a, b) => (a.id - b.id) * direction);
});

// kelompokkan per kolom groupBy, urutan grup mengikuti urutan opsi
const groups = computed(() => {
  if (!props.groupBy) return [{ name: null, rows: visible.value }];

  const field = props.fields.find((f) => f.key === props.groupBy);
  const order = optionsOf(field).map((o) => o.label);
  const map = new Map();
  for (const item of visible.value) {
    const label = display(item, field) || "-";
    if (!map.has(label)) map.set(label, []);
    map.get(label).push(item);
  }

  const rank = (label) =>
    order.includes(label) ? order.indexOf(label) : order.length;
  return [...map]
    .map(([label, rows]) => ({ name: label, rows }))
    .sort((a, b) => rank(a.name) - rank(b.name));
});

function openAdd() {
  reset();
  formOpen.value = true;
}

function openEdit(item) {
  edit(item);
  formOpen.value = true;
}

function closeForm() {
  reset();
  formOpen.value = false;
}

async function submit() {
  await save();
  if (!error.value) {
    formOpen.value = false;
    emit("changed");
  }
}

async function destroy(id) {
  await remove(id);
  emit("changed");
}

onMounted(async () => {
  for (const field of props.fields.filter((f) => f.source)) {
    const rows = await field.source.list();
    lookups[field.key] = rows.map((row) => ({
      value: row.id,
      label: row[field.sourceLabel ?? "name"],
    }));
  }
  await load();
});
</script>

<template>
  <div class="crud">
    <div class="toolbar">
      <component :is="headingTag" v-if="title">{{ title }}</component>
      <span v-else></span>
      <div class="actions">
        <input v-model="search" class="search" placeholder="Search" />
        <select v-if="filterField" v-model="filter" class="search">
          <option value="">Filter by</option>
          <option
            v-for="o in optionsOf(filterField)"
            :key="o.value"
            :value="o.value"
          >
            {{ o.label }}
          </option>
        </select>
        <button v-if="editable" @click="openAdd">{{ addLabel }}</button>
        <slot name="toolbar" />
      </div>
    </div>
    <p v-if="error && !formOpen" class="error">{{ error }}</p>

    <template v-for="group in groups" :key="group.name">
      <h3 v-if="groupBy" class="group-title">{{ group.name }}</h3>
      <div class="card list-card">
        <template v-if="layout === 'list'">
          <div v-for="item in group.rows" :key="item.id" class="list-row">
            <div class="thumb">{{ row.thumb ? row.thumb(item) : "" }}</div>
            <div class="list-body">
              <small class="label">{{ row.label(item) }}</small>
              <div class="list-title">{{ row.title(item) }}</div>
              <div v-if="row.subtitle" class="list-sub">
                {{ row.subtitle(item) }}
              </div>
            </div>
            <div class="actions">
              <slot name="actions" :item="item" />
              <RowMenu
                v-if="editable"
                @edit="openEdit(item)"
                @remove="destroy(item.id)"
              />
            </div>
          </div>
        </template>

        <template v-else-if="layout === 'details'">
          <div v-for="item in group.rows" :key="item.id" class="details">
            <div class="info">
              <div v-for="field in fields" :key="field.key">
                <small>{{ field.label }}</small>
                <div>{{ display(item, field) || "-" }}</div>
              </div>
            </div>
            <RowMenu
              v-if="editable"
              @edit="openEdit(item)"
              @remove="destroy(item.id)"
            />
          </div>
        </template>

        <table v-else>
          <thead v-if="!hideHeader">
            <tr>
              <th v-if="numbered"></th>
              <th v-for="field in columns" :key="field.key">
                {{ field.label }}
              </th>
              <th v-if="editable || $slots.actions"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in group.rows"
              :key="item.id"
              :class="{ clickable: rowTo }"
              @click="rowTo && router.push(rowTo(item))"
            >
              <td v-if="numbered" class="num">{{ index + 1 }}</td>
              <td v-for="field in columns" :key="field.key">
                <template v-if="field.image">
                  <img
                    v-if="field.image(item)"
                    :src="field.image(item)"
                    class="mini"
                    alt=""
                  />
                  <span v-else class="mini"></span>
                </template>
                <span
                  v-if="field.badge && field.badge(item)"
                  class="approved"
                  >{{ field.badge(item) }}</span
                >
                <StatusBadge
                  v-if="field.key === 'status' && item.status"
                  :status="item.status"
                />
                <template v-else>{{ display(item, field) }}</template>
              </td>
              <td v-if="editable || $slots.actions" class="actions" @click.stop>
                <div class="actions">
                  <slot name="actions" :item="item" />
                  <RowMenu
                    v-if="editable"
                    @edit="openEdit(item)"
                    @remove="destroy(item.id)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <p v-if="!visible.length" class="empty">Belum ada data.</p>

    <div v-if="formOpen" class="backdrop" @click.self="closeForm">
      <div class="card modal">
        <h2>{{ editingId ? `Edit ${name}` : `Add ${name}` }}</h2>
        <p v-if="error" class="error">{{ error }}</p>
        <form @submit.prevent="submit">
          <label v-for="field in fields" :key="field.key">
            {{ field.label }}
            <select v-if="field.type === 'select'" v-model="form[field.key]">
              <option value="">-</option>
              <option
                v-for="o in optionsOf(field)"
                :key="o.value"
                :value="o.value"
              >
                {{ o.label }}
              </option>
            </select>
            <input
              v-else-if="field.type === 'checkbox'"
              type="checkbox"
              v-model="form[field.key]"
              :true-value="1"
              :false-value="0"
            />
            <input v-else :type="field.type" v-model="form[field.key]" />
          </label>
          <div class="actions">
            <button type="submit">Simpan</button>
            <button type="button" class="secondary" @click="closeForm">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
