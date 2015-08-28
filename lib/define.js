var _ = require('lodash');
var pluralize = require('pluralize');
var capitalize = require('capitalize');

module.exports = function(orm, name, fields, options) {
  name = capitalize(name);

  var erase = options && options.erase;
  if (!orm[name] || erase) {
    orm[name] = {
      fields: {},
      table: pluralize(name),
      hooks: {},
      primaryKey: null,
      createdAt: 'createdAt',
      modifiedAt: 'modifiedAt'
    };
  }

  if (options) {
    if (options.tableName)
      orm[name].table = options.tableName;
    if (options.createdAt !== undefined)
      orm[name].createdAt = options.createdAt;
    if (options.modifiedAt !== undefined)
      orm[name].modifiedAt = options.modifiedAt;
  }

  _.each(fields, function(field, fieldName) {
    if (!orm[name].fields[fieldName] || erase) {
      orm[name].fields[fieldName] = {
	fieldName: fieldName,
	defaultValues: {
	  created: null,
	  modified: null
	}
      };
    }
    if (field.required)
      orm[name].fields[fieldName].required = field.required;
    var defaultValues = orm[name].fields[fieldName];
    if (field.default) {
      if (field.default instanceof Array) {
	defaultValues.created = field.default[0];
	defaultValues.modified = field.default[field.default.length == 1 ? 0 : 1];
      }
      else if (field.default instanceof String || typeof field.default == 'string')
	defaultValues.created = field.default;
      else {
	if (field.default.created)
	  defaultValues.created = field.default.created;
	if (field.default.modified)
	  defaultValues.modified = field.default.modified;
      }
    }
    if (field.defaultCreated)
      defaultValues.created = field.default.created;
    if (field.defaultModified)
      defaultValues.modified = field.default.modified;
    orm[name].fields[fieldName] = defaultValues;
  });
}
