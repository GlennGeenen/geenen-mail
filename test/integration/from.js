'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const Assert = require('assert');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Mail API', () => {

  let server;
  const from = 'from@geenentijd.be';

  const MailMock = {
    configure: function (options, callback) {

      callback();
    },
    sendMail: function (mail, callback) {

      Assert(mail.from === from, `${mail.from} should equal ${from}`);
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
        from: 'Glenn Geenen <glenn@geenentijd.be>',
        route: {},
        templates: [{
          name: 'text',
          subject: 'Test TEXT email',
          schema: Joi.object({
            me: Joi.string().required()
          })
        }]
      }
    }, done);
  });

  lab.experiment('Send Text Mail', () => {

    lab.test('should use from in payload', (done) => {

      const options = {
        method: 'POST',
        url: '/mail',
        payload: {
          recipients: [{
            email: 'glenn@geenentijd.be'
          }],
          template: 'text',
          from: {
            email: from
          },
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
