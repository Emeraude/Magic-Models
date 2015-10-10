var _ = require('lodash');
var pluralize = require('pluralize');
var capitalize = require('capitalize');

function _default(orm, modelName, fieldName, field) {
  var defaultValues = orm[modelName].fields[fieldName];
  if (field.default) {
    if (field.default instanceof Array) {
      defaultValues.default.created = field.default[0];
      defaultValues.default.modified = field.default[field.default.length == 1 ? 0 : 1];
    }
    else if (field.default instanceof String || typeof field.default == 'string')
      defaultValues.default.created = field.default;
    else {
      if (field.default.created)
	defaultValues.default.created = field.default.created;
      if (field.default.modified)
	defaultValues.default.modified = field.default.modified;
    }
  }
  if (field.defaultCreated)
    defaultValues.default.created = field.defaultCreated;
  if (field.defaultModified)
    defaultValues.default.modified = field.defaultModified;
  if (field.defaultBoth) {
    defaultValues.default.created = field.defaultBoth;
    defaultValues.default.modified = field.defaultBoth;
  }
  return defaultValues;
}

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
      modifiedAt: 'modifiedAt',
    };
    orm[name].find = function(options, cb) {
      require('./find')(orm, orm[name], options, cb);
    }
    orm[name].create = function(options, cb) {
      require('./create')(orm, orm[name], options, cb);
    }
    orm[name].update = function(options, cb) {
      require('./update')(orm, orm[name], options, cb);
    }
    orm[name].delete = function(options, cb) {
      require('./delete')(orm, orm[name], options, cb);
    }
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
	default: {
	  created: null,
	  modified: null
	}
      };
    }
    if (field.required)
      orm[name].fields[fieldName].required = field.required;
    orm[name].fields[fieldName] = _default(orm, name, fieldName, field);
  });
}
