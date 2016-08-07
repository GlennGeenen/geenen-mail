# Geenen Mail Hapi Plugin

[![Build Status](https://travis-ci.org/GlennGeenen/geenen-mail.svg?branch=master)](https://travis-ci.org/GlennGeenen/geenen-mail)

This is a Hapi plugin for sending emails as used by GeenenTijd. It uses Handlebars for templating. Compatible with Glue.

## Install

```
npm i geenen-mail --save
```

## Register

This example uses the geenen-mail-aws service.

```
server.register({
  register: require('geenen-mail'),
  options: {
    service: require('geenen-mail-aws'),
    options: {
      region: 'eu-west-1',
      accessKeyId: 'accesskey',
      secretAccessKey: 'secretkey'
    }, // Options from the service
    path: `${__dirname}/../templates`, // Required, templates directory
    route: {
      path: '/my/mail/path', // Default /mail
      cors: true, // Default false
      auth: 'myAuth' // Default none
    }, // Optional, will add route to server when defined
    from: 'Glenn Geenen <glenn@geenentijd.be>' // Required, from fallback
    templates: [{
      name: 'contact', // Required, should be name of the hbs file
      subject: 'Contact Form', // Required, subject fallback
      schema: Joi.object({
        message: Joi.string().required()
      }), // Optional, joi validation schema
    }]
  }
});
```

## Mail

The plugin exposes a mail method.

```
function (request, reply) {

  request.server.methods.mail(request.payload, (err) => {

    if (err) {
      return reply(err);
    }
    return reply({ message: 'Email sent.' });
  });

}
```

## Payload

The payload to send to the mail endpoint or mail method.

```
{
  from: {
    name: 'Glenn Geenen', // Optional
    email: 'glenn@geenentijd.be' // Required
  }, // Falls back on from in plugin
  recipients: [{
    name: 'Glenn Geenen', // Optional
    email: 'glenn@geenentijd.be' // Required
  }], // Required
  subject: 'Contact Me', // Either define here or in template
  template: 'text', // Required
  body: {
    message: 'Hello'
  } // Must match schema
}
```

## Transports

- geenen-mail-nodemailer
- geenen-mail-mailgun
- geenen-mail-ses
