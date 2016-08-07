'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const Assert = require('assert');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Mail API', () => {

  let server;

  lab.experiment('Register plugin', () => {

    lab.test('should fail for missing file', (done) => {

      const MailMock = {
        configure: function (options, callback) {

          callback();
        },
        sendMail: function (mail, callback) {

          callback();
        }
      };

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
            name: 'missing',
            subject: 'Test MISSING email',
            schema: Joi.object({
              me: Joi.string().required()
            })
          }]
        }
      }, (err) => {

        Assert(err !== null);
        done();
      });
    });

    lab.test('should fail on service', (done) => {

      const MailMock = {
        configure: function (options, callback) {

          callback(new Error('Ooh dear!!!'));
        },
        sendMail: function (mail, callback) {

          callback();
        }
      };

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
      }, (err) => {

        Assert(err !== null);
        done();
      });
    });

  });
});
