import { formatDate } from "../utils/format";

const humanize = (value) => String(value ?? "").replace(/_/g, " ");

export const workOrderRow = {
  label: (item) => humanize(item.status),
  title: (item) => [item.job_code, item.title].filter(Boolean).join(" "),
  subtitle: (item) => item.equipment,
};

export const updateRow = {
  label: (item) => humanize(item.status),
  title: (item) =>
    `${[item.job_code, item.title].filter(Boolean).join(" ")} | Responsible User: ${item.responsible_user ?? "-"}`,
  subtitle: (item) =>
    `Last Updated: ${formatDate(item.last_updated_at, true)} by ${item.last_updated_by ?? "-"} | Progress: ${item.progress}%`,
};

export const taskRow = {
  label: (item) => item.category,
  title: (item) =>
    `Responsibility ${item.responsible ?? "-"}, Due Date: ${formatDate(item.due_date)}`,
  subtitle: (item) => item.description,
};

export const attachmentRow = {
  thumb: (item) =>
    item.file_name.includes(".")
      ? item.file_name.split(".").pop().toUpperCase()
      : "",
  label: (item) => item.file_name,
  title: (item) => item.title ?? "Include in Specs",
  subtitle: (item) => (item.include_in_specs ? "Yes" : "No"),
};
