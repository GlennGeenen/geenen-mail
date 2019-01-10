'use strict';

const Joi = require('joi');
const Boom = require('boom');

const TemplateNames = require('./templateNames');

let templates;
let joiSchema;

const setTemplates = function (tmplts) {

  templates = tmplts;

  joiSchema = Joi.object({
    from: Joi.object({
      name: Joi.string(),
      email: Joi.string().email().required()
    }),
    recipients: Joi.array().items(Joi.object({
      name: Joi.string(),
      email: Joi.string().email().required()
    })).min(1),
    subject: Joi.string(),
    template: Joi.string().valid(TemplateNames(templates)).required(),
    attachments: Joi.array({
      fileName:  Joi.string().required(),
      contentType: Joi.string().required(),
      content: Joi.string().required()
    })
  });
};

const findTemplate = function (templateName) {

  for (let i = 0; i < templates.length; ++i) {
    if (templates[i].name === templateName) {
      return templates[i];
    }
  }
};

const getTemplate = function getTemplate(payload, next) {

  const template = findTemplate(payload.template);
  if (!template) {
    return next(Boom.badRequest('No valid template'));
  }
  if (!template.schema) {
    return next(null, template);
  }

  const schema = joiSchema.keys({
    body: template.schema
  });

  const onValidated = function (err) {

    if (err) {
      return next(Boom.wrap(err, 400));
    }
    return next(null, template);
  };

  return Joi.validate(payload, schema, onValidated);
};

module.exports = {
  setTemplates,
  getTemplate
};
