class BaseController {
  constructor(model) {
    this.model = model;
  }

  // supaya error dari async function masuk ke error handler express
  handle(fn) {
    return (req, res, next) => Promise.resolve(fn(req, res)).catch(next);
  }

  index = this.handle(async (req, res) => {
    res.json(await this.model.findAll(req.query));
  });

  show = this.handle(async (req, res) => {
    res.json(await this.model.findById(req.params.id));
  });

  store = this.handle(async (req, res) => {
    res.status(201).json(await this.model.create(req.body));
  });

  update = this.handle(async (req, res) => {
    res.json(await this.model.update(req.params.id, req.body));
  });

  patch = this.handle(async (req, res) => {
    res.json(await this.model.patch(req.params.id, req.body));
  });

  destroy = this.handle(async (req, res) => {
    await this.model.remove(req.params.id);
    res.status(204).end();
  });
}

module.exports = BaseController;
