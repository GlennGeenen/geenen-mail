'use strict';

const Assert = require('assert');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('TemplateNames', () => {

  const TemplateNames = require('../../lib/templateNames');

  lab.test('should return template names', (done) => {

    const result = TemplateNames([{
      name: 'text',
      subject: 'Test TEXT email',
      schema: {}
    }, {
      name: 'html',
      subject: 'Test HTML email',
      schema: {}
    }]);

    Assert(result.length === 2);
    Assert(result[0] === 'text');
    Assert(result[1] === 'html');
    done();
  });

  lab.test('should return template with names', (done) => {

    const result = TemplateNames([{
      name: 'text',
      subject: 'Test TEXT email',
      schema: {}
    }, {
      subject: 'Test HTML email',
      schema: {}
    }]);

    Assert(result.length === 1);
    Assert(result[0] === 'text');
    done();
  });
});
