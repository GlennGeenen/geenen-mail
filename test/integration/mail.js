'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const Assert = require('assert');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Mail API', () => {

  let server;
  const from = 'Glenn Geenen <glenn@geenentijd.be>';

  const MailMock = {
    configure: function (options, callback) {

      callback();
    },
    sendMail: function (mail, callback) {

      Assert(mail.from === from);
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
        route: {},
        from: from,
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

  lab.experiment('Send Text Mail', () => {

    lab.test('should require recipient', (done) => {

      const options = {
        method: 'POST',
        url: '/mail',
        payload: {
          recipients: [],
          template: 'text',
          body: {
            me: 'Glenn Geenen'
          }
        }
      };

      server.inject(options, (response) => {

        Assert(response.statusCode === 400);
        done();
      });
    });

    lab.test('should require email', (done) => {

      const options = {
        method: 'POST',
        url: '/mail',
        payload: {
          recipients: [{
            name: 'Glenn Geenen'
          }],
          template: 'contact',
          body: {
            me: 'Glenn Geenen'
          }
        }
      };

      server.inject(options, (response) => {

        Assert(response.statusCode === 400);
        done();
      });
    });

    lab.test('should require template', (done) => {

      const options = {
        method: 'POST',
        url: '/mail',
        payload: {
          recipients: [{
            name: 'Glenn Geenen',
            email: 'glenn@geenentijd.be'
          }],
          body: {
            me: 'Glenn Geenen'
          }
        }
      };

      server.inject(options, (response) => {

        Assert(response.statusCode === 400);
        done();
      });
    });

    lab.test('should require valid template', (done) => {

      const options = {
        method: 'POST',
        url: '/mail',
        payload: {
          recipients: [{
            name: 'Glenn Geenen',
            email: 'glenn@geenentijd.be'
          }],
          template: 'random',
          body: {
            me: 'Glenn Geenen'
          }
        }
      };

      server.inject(options, (response) => {

        Assert(response.statusCode === 400);
        done();
      });
    });

    lab.test('should require valid body', (done) => {

      const options = {
        method: 'POST',
        url: '/mail',
        payload: {
          recipients: [{
            name: 'Glenn Geenen',
            email: 'glenn@geenentijd.be'
          }],
          template: 'text',
          body: {
            random: 'Glenn Geenen'
          }
        }
      };

      server.inject(options, (response) => {

        Assert(response.statusCode === 400);
        done();
      });
    });

    lab.test('should send email', (done) => {

      const options = {
        method: 'POST',
        url: '/mail',
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

  lab.experiment('Send HTML Mail', () => {

    lab.test('should require valid body', (done) => {

      const options = {
        method: 'POST',
        url: '/mail',
        payload: {
          recipients: [{
            name: 'Glenn Geenen',
            email: 'glenn@geenentijd.be'
          }],
          template: 'html',
          body: {}
        }
      };

      server.inject(options, (response) => {

        Assert(response.statusCode === 400);
        done();
      });
    });

    lab.test('should send email', (done) => {

      const options = {
        method: 'POST',
        url: '/mail',
        payload: {
          recipients: [{
            name: 'Glenn Geenen',
            email: 'glenn@geenentijd.be'
          }],
          template: 'html',
          body: {
            sender: 'Glenn Geenen'
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
