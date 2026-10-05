import ApiService from './ApiService';
import DryDockService from './DryDockService';

export const dryDockService = new DryDockService();
export const vesselService = new ApiService('vessels');
export const shipyardService = new ApiService('shipyards');
export const specGroupService = new ApiService('spec-groups');
export const workOrderMasterService = new ApiService('work-order-masters');
export const workOrderService = new ApiService('work-orders');
export const attachmentService = new ApiService('attachments');
export const purchaseOrderService = new ApiService('purchase-orders');
export const checklistService = new ApiService('checklists');
export const taskService = new ApiService('tasks');
export const rfqService = new ApiService('rfqs');
export const quotationDetailService = new ApiService('quotation-details');
export const reportService = new ApiService('reports');
export const executionRecordService = new ApiService('execution-records');
export const specUpdateService = new ApiService('spec-updates');
