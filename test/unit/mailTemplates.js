'use strict';

const Joi = require('joi');
const Assert = require('assert');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('MailTemplates', () => {

  const MailTemplates = require('../../lib/mailTemplates');

  lab.test('should get template', (done) => {

    MailTemplates.setTemplates([{
      name: 'text',
      subject: 'Test TEXT email',
      schema: Joi.object({
        me: Joi.string().required()
      })
    }]);

    MailTemplates.getTemplate({
      recipients: [{
        name: 'Glenn Geenen',
        email: 'glenn@geenentijd.be'
      }],
      template: 'text',
      body: {
        me: 'Glenn Geenen'
      }
    }, (err, template) => {

      Assert(err === null);
      Assert(template.name === 'text');
      Assert(template.subject === 'Test TEXT email');
      done();
    });
  });

  lab.test('should get template without schema', (done) => {

    MailTemplates.setTemplates([{
      name: 'text',
      subject: 'Test TEXT email'
    }]);

    MailTemplates.getTemplate({
      recipients: [{
        name: 'Glenn Geenen',
        email: 'glenn@geenentijd.be'
      }],
      template: 'text',
      body: {
        sender: 'Glenn Geenen'
      }
    }, (err, template) => {

      Assert(err === null);
      Assert(template.name === 'text');
      Assert(template.subject === 'Test TEXT email');
      done();
    });
  });

  lab.test('should not find template', (done) => {

    MailTemplates.setTemplates([{
      name: 'text',
      subject: 'Test TEXT email',
      schema: Joi.object({
        me: Joi.string().required()
      })
    }]);

    MailTemplates.getTemplate({
      recipients: [{
        name: 'Glenn Geenen',
        email: 'glenn@geenentijd.be'
      }],
      template: 'random',
      body: {
        me: 'Glenn Geenen'
      }
    }, (err, template) => {

      Assert(err !== null);
      Assert(err.isBoom);
      Assert(template === undefined);
      done();
    });
  });

  lab.test('should fail to validate template', (done) => {

    MailTemplates.setTemplates([{
      name: 'text',
      subject: 'Test TEXT email',
      schema: Joi.object({
        me: Joi.string().required()
      })
    }]);

    MailTemplates.getTemplate({
      recipients: [{
        name: 'Glenn Geenen',
        email: 'glenn@geenentijd.be'
      }],
      template: 'text',
      body: {
        sender: 'Glenn Geenen'
      }
    }, (err, template) => {

      Assert(err !== null);
      Assert(err.isBoom);
      Assert(err.isJoi);
      Assert(template === undefined);
      done();
    });
  });

});
