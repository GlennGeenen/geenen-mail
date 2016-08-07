'use strict';

const Mailer = require('./lib/mailer');

exports.register = function (server, options, next) {

  // Filter out templates without name
  options.templates = options.templates.filter((template) => {

    return template.name;
  });

  // Setup Mailer
  Mailer.configure(options, (err) => {

    if (err) {
      return next(err);
    }

    // Register mail method
    server.method('mail', Mailer.mail);

    // Register mail route
    if (options.route) {
      server.route(require('./route')(options));
    }

    next();
  });
};

exports.register.attributes = {
  pkg: require('./package.json')
};
