'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const Assert = require('assert');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Mail API', () => {

  let server;
  const MailPath = '/custompath';

  const MailMock = {
    configure: function (options, callback) {

      callback();
    },
    sendMail: function (mail, callback) {

      // Should send text email
      Assert(mail.text !== undefined);
      Assert(mail.html === undefined);
      callback();
    }
  };

  // We setup Hapi Server and configure geenen-mail plugin
  lab.before((done) => {

    server = new Hapi.Server();
    server.connection({ port: 0 });

    server.register({
      register: require('../../'),
      options: {
        service: MailMock,
        path: `${__dirname}/../templates`,
        route: {
          path: MailPath
        },
        from: 'Glenn Geenen <glenn@geenentijd.be>',
        templates: [{
          name: 'text',
          subject: 'Test TEXT email',
          schema: Joi.object({
            me: Joi.string().required()
          })
        }, {
          name: 'html',
          subject: 'Test HTML email',
          schema: Joi.object({
            sender: Joi.string().required()
          })
        }]
      }
    }, done);
  });

  lab.experiment('Custom Mail Path', () => {

    lab.test('should send email', (done) => {

      const options = {
        method: 'POST',
        url: MailPath,
        payload: {
          recipients: [{
            email: 'glenn@geenentijd.be'
          }],
          template: 'text',
          body: {
            me: 'Glenn Geenen'
          }
        }
      };

      server.inject(options, (response) => {

        Assert(response.statusCode === 200);
        done();
      });
    });
  });
});
