import {
  vesselService,
  shipyardService,
  specGroupService,
  dryDockService,
  workOrderMasterService,
  checklistService,
} from "../services";

const workOrderStatuses = ["open", "in_progress", "on_hold", "complete"];

export const vesselFields = [
  { key: "name", label: "Name", type: "text" },
  { key: "imo_number", label: "IMO No.", type: "text" },
  { key: "type", label: "Type", type: "text" },
  { key: "owner", label: "Owner", type: "text" },
  { key: "image_url", label: "Image URL", type: "text", table: false },
];

export const shipyardFields = [
  { key: "name", label: "Name", type: "text" },
  { key: "location", label: "Location", type: "text" },
];

export const specGroupFields = [{ key: "name", label: "Name", type: "text" }];

export const workOrderMasterFields = [
  { key: "title", label: "Title", type: "text" },
  { key: "equipment", label: "Equipment", type: "text" },
  {
    key: "spec_group_id",
    label: "Spec Group",
    type: "select",
    source: specGroupService,
  },
];

export const checklistFields = [
  { key: "title", label: "Title", type: "text" },
  {
    key: "dry_dock_id",
    label: "Dry Dock",
    type: "select",
    source: dryDockService,
    sourceLabel: "dry_dock_no",
  },
  { key: "is_done", label: "Done", type: "checkbox" },
];

export const dryDockFields = [
  { key: "dry_dock_no", label: "Dry Dock No", type: "text" },
  { key: "vessel_id", label: "Vessel", type: "select", source: vesselService },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["planning", "execution", "completed"],
  },
  { key: "budget", label: "Budget", type: "number" },
  { key: "description", label: "Description", type: "text", table: false },
  { key: "company", label: "Company", type: "text", table: false },
  { key: "account_code", label: "Account Code", type: "text", table: false },
  {
    key: "responsible_rank",
    label: "Responsible Rank",
    type: "text",
    table: false,
  },
  { key: "manager", label: "Manager (User)", type: "text", table: false },
  { key: "currency", label: "Currency", type: "text", table: false },
  {
    key: "priority",
    label: "Priority",
    type: "select",
    options: ["low", "medium", "high"],
    table: false,
  },
  {
    key: "shipyard_id",
    label: "Shipyard",
    type: "select",
    source: shipyardService,
    table: false,
  },
  { key: "planned_start", label: "Planned Start", type: "date", table: false },
  { key: "planned_end", label: "Planned End", type: "date", table: false },
  { key: "actual_start", label: "Actual Start", type: "date", table: false },
  { key: "actual_end", label: "Actual End", type: "date", table: false },
];

export const dryDockMinimalColumns = [
  {
    key: "dry_dock_no",
    label: "Dry Dock No",
    image: (item) => item.vessel_image,
  },
  { key: "description", label: "Description" },
  { key: "vessel_name", label: "Vessel" },
];

export const dryDockDetailedColumns = [
  { key: "dry_dock_no", label: "Dry Dock No" },
  { key: "description", label: "Description" },
  { key: "manager", label: "Manager (User)" },
  { key: "planned_start", label: "Planned Start Date", type: "date" },
  { key: "planned_end", label: "Planned End Date", type: "date" },
  { key: "actual_start", label: "Actual Start Date", type: "date" },
  { key: "actual_end", label: "Actual End Date", type: "date" },
  { key: "status", label: "Status" },
  { key: "spec_count", label: "No of Specs" },
];

export const workOrderFields = [
  { key: "job_code", label: "Job Code", type: "text", table: false },
  {
    key: "spec_group_id",
    label: "Spec Group",
    type: "select",
    source: specGroupService,
  },
  { key: "title", label: "Title", type: "text" },
  { key: "equipment", label: "Equipment", type: "text" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: workOrderStatuses,
  },
  {
    key: "responsible_user",
    label: "Responsible User",
    type: "text",
    table: false,
  },
  { key: "budget", label: "Budget", type: "number", table: false },
  {
    key: "yard_estimate",
    label: "Yard Estimate",
    type: "number",
    table: false,
  },
  {
    key: "owner_estimate",
    label: "Owner Estimate",
    type: "number",
    table: false,
  },
  {
    key: "actual_yard_cost",
    label: "Actual Yard Cost",
    type: "number",
    table: false,
  },
  {
    key: "actual_owner_cost",
    label: "Actual Owner Cost",
    type: "number",
    table: false,
  },
];

export const sheetFields = [
  { key: "job_code", label: "Job Code", type: "text" },
  { key: "title", label: "Job Name", type: "text" },
  {
    key: "spec_group_id",
    label: "Specification Group",
    type: "select",
    source: specGroupService,
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: workOrderStatuses,
  },
  { key: "progress", label: "Progress", type: "number", suffix: "%" },
];

export const attachmentFields = [
  { key: "file_name", label: "File Name", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "include_in_specs", label: "Include in Specs", type: "checkbox" },
];

export const purchaseOrderFields = [
  {
    key: "po_number",
    label: "Purchase Order No.",
    type: "text",
    badge: (item) => (item.approved ? "Approved" : ""),
  },
  {
    key: "category",
    label: "Category",
    type: "select",
    options: ["inventory", "spare_part", "machinery"],
  },
  { key: "total", label: "Total (USD)", type: "number" },
  { key: "supplier", label: "Supplier", type: "text" },
  { key: "approved", label: "Approved", type: "checkbox", table: false },
];

export const taskFields = [
  { key: "category", label: "Requirement", type: "text" },
  { key: "responsible", label: "Responsibility", type: "text" },
  { key: "due_date", label: "Due Date", type: "date" },
  { key: "description", label: "Description", type: "text" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["open", "closed", "in_progress"],
  },
];

export const rfqFields = [
  { key: "rfq_no", label: "RFQ No.", type: "text" },
  { key: "rfq_date", label: "RFQ Date", type: "date" },
  { key: "expiry_date", label: "RFQ Expiry Date", type: "date" },
  { key: "comments", label: "RFQ Comments", type: "text" },
];

export const quotationDetailFields = [
  {
    key: "spec_group_id",
    label: "Specification Group",
    type: "select",
    source: specGroupService,
  },
  { key: "job_code", label: "Job Code", type: "text" },
  { key: "job_name", label: "Job Name", type: "text" },
  { key: "vessel_name", label: "Vessel Name", type: "text" },
  { key: "machinery_group", label: "Machinery Group", type: "text" },
  { key: "machinery", label: "Machinery", type: "text" },
];

export const reportFields = [
  { key: "name", label: "Name", type: "text" },
  { key: "updated_by", label: "Updated By", type: "text" },
  { key: "report_date", label: "Report Date", type: "date" },
];

export const executionRecordFields = [
  { key: "title", label: "Title", type: "text" },
  { key: "description", label: "Description", type: "text" },
  { key: "record_date", label: "Date", type: "date" },
  { key: "amount", label: "Amount", type: "number" },
];

export const pages = {
  vessels: {
    title: "Vessels",
    itemName: "Vessel",
    service: vesselService,
    fields: vesselFields,
  },
  shipyards: {
    title: "Shipyards",
    itemName: "Shipyard",
    service: shipyardService,
    fields: shipyardFields,
  },
  specGroups: {
    title: "Specification Groups",
    itemName: "Specification Group",
    service: specGroupService,
    fields: specGroupFields,
  },
  workOrderMasters: {
    title: "Work Order Master",
    itemName: "Work Order",
    service: workOrderMasterService,
    fields: workOrderMasterFields,
  },
  checklists: {
    title: "Checklist",
    itemName: "Checklist Item",
    service: checklistService,
    fields: checklistFields,
  },
};
