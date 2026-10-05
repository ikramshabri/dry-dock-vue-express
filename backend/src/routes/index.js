const { Router } = require('express');
const BaseController = require('../controllers/BaseController');
const DryDockController = require('../controllers/DryDockController');

const Vessel = require('../models/Vessel');
const Shipyard = require('../models/Shipyard');
const SpecGroup = require('../models/SpecGroup');
const WorkOrderMaster = require('../models/WorkOrderMaster');
const WorkOrder = require('../models/WorkOrder');
const Attachment = require('../models/Attachment');
const PurchaseOrder = require('../models/PurchaseOrder');
const Checklist = require('../models/Checklist');
const Task = require('../models/Task');
const Rfq = require('../models/Rfq');
const QuotationDetail = require('../models/QuotationDetail');
const Report = require('../models/Report');
const ExecutionRecord = require('../models/ExecutionRecord');
const SpecUpdate = require('../models/SpecUpdate');

const router = Router();

function mount(path, controller) {
  router.route(`/${path}`).get(controller.index).post(controller.store);
  router
    .route(`/${path}/:id`)
    .get(controller.show)
    .put(controller.update)
    .patch(controller.patch)
    .delete(controller.destroy);
}

const resources = {
  vessels: Vessel,
  shipyards: Shipyard,
  'spec-groups': SpecGroup,
  'work-order-masters': WorkOrderMaster,
  'work-orders': WorkOrder,
  attachments: Attachment,
  'purchase-orders': PurchaseOrder,
  checklists: Checklist,
  tasks: Task,
  rfqs: Rfq,
  'quotation-details': QuotationDetail,
  reports: Report,
  'execution-records': ExecutionRecord,
  'spec-updates': SpecUpdate,
};

for (const [path, model] of Object.entries(resources)) {
  mount(path, new BaseController(model));
}

const dryDocks = new DryDockController();
router.get('/dry-docks/:id/summary', dryDocks.summary);
router.post('/dry-docks/:id/start', dryDocks.start);
router.post('/dry-docks/:id/copy-estimates', dryDocks.copyEstimates);
mount('dry-docks', dryDocks);

module.exports = router;
