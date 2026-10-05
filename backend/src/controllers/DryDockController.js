const BaseController = require('./BaseController');
const DryDock = require('../models/DryDock');

class DryDockController extends BaseController {
  constructor() {
    super(DryDock);
  }

  summary = this.handle(async (req, res) => {
    res.json(await DryDock.summary(req.params.id));
  });

  start = this.handle(async (req, res) => {
    res.json(await DryDock.start(req.params.id));
  });

  copyEstimates = this.handle(async (req, res) => {
    await DryDock.copyEstimates(req.params.id);
    res.json(await DryDock.summary(req.params.id));
  });
}

module.exports = DryDockController;
