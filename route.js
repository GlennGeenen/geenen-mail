'use strict';

const Mailer = require('./lib/mailer');

const getMailRoute = function (options) {

  return {
    method: 'POST',
    path: options.route.path || '/mail',
    config: {
      cors: options.route.cors,
      auth: options.route.auth,
      tags: ['api', 'mail']
    },
    handler: function sendMail(request, reply) {

      const onSend = function (err) {

        if (err) {
          request.log(['error', 'mail'], err);
          return reply(err);
        }
        return reply({ message: 'Email sent.' });
      };

      Mailer.mail(request.payload, onSend);
    }
  };
};

module.exports = getMailRoute;
