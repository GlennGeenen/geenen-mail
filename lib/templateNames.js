'use strict';

const mapTemplateName = function (template) {

  return template.name;
};

const getTemplateNames = function (templates) {

  return templates.filter(mapTemplateName).map(mapTemplateName);
};

module.exports = getTemplateNames;
