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

  if (options.tableName)
    orm[name].table = options.tableName;

  if (options.createdAt !== undefined)
    orm[name].createdAt = createdAt;
  if (options.modifiedAt !== undefined)
    orm[name].modifiedAt = modifiedAt;

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
  });
}
