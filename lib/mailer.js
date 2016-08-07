'use strict';

const Fs = require('fs');
const IsHtml = require('is-html');
const Handlebars = require('handlebars');

const TemplateNames = require('./templateNames');
const MailTemplates = require('./mailTemplates');

// Variables
const templates = {};
let service;
let from;

const compileTemplates = function (options, next) {

  // Async is only used during setup
  const Async = require('async');

  const compileTemplate = function (template, callback) {

    const readFile = function (err, source) {

      if (err) {
        return callback(err);
      }
      templates[template] = Handlebars.compile(source.toString());
      return callback();
    };

    Fs.readFile(`${options.path}/${template}.hbs`, readFile);
  };

  const names = TemplateNames(options.templates);
  Async.each(names, compileTemplate, next);
};

const configure = function (options, callback) {

  // Save options for later use
  service = options.service;
  from = options.from;
  MailTemplates.setTemplates(options.templates);

  // Configure service
  service.configure(options, (err) => {

    if (err) {
      return callback(err);
    }

    // Compile templates
    compileTemplates(options, callback);
  });
};

const mapRecipient = function (recipient) {

  if (recipient.name) {
    return `${recipient.name} <${recipient.email}>`;
  }
  return recipient.email;
};

const mail = function (payload, callback) {

  const onValidated = function (err, template) {

    if (err) {
      return callback(err);
    }

    // Add/update data for mail
    payload.from = payload.from ? mapRecipient(payload.from) : from;
    payload.subject = payload.subject || template.subject;
    payload.recipients = payload.recipients.map(mapRecipient);

    // Process handlebars template
    const content = templates[template.name](payload.body);
    if (IsHtml(content)) {
      payload.html = content;
    }
    else {
      payload.text = content;
    }

    service.sendMail(payload, callback);
  };

  MailTemplates.getTemplate(payload, onValidated);
};

module.exports = {
  configure,
  mail
};
