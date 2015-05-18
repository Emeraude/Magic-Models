var _ = require('lodash');
var plural = require('plural');
var selects = require('./selects');
var inserts = require('./inserts');
var deletes = require('./deletes');
var updates = require('./updates');
var describes = require('./describes');
var defineValidate = require('./defineValidate');
var hooks = require('./hooks');

module.exports.define = function(name, fields, options, orm) {
    var erase = false;

    if (options && options.erase)
	erase = true;

    var model;
    if (orm.models[name] && !erase)
	model = orm.models[name];
    else {
	model = {
	    fields: {},
	    name: name,
	    table: plural(name),
	    hasOne: {},
	    hasMany: {},
	    hooks: {},
	    primaryKey: null,
	    createdAt: 'createdAt',
	    modifiedAt: 'modifiedAt'
	};
    }
    addQueryMethods(model, orm);

    _.each(hooks, function(hook, name) {
	model[name] = hook;
    });

    _.each(fields, function(field, fieldName) {
	var fieldSaved = {
	    fieldName: field.fieldName || fieldName
	};
	var defaultValues = {
	    created: field.defaultBoth || field.defaultCreated || null,
	    modified: field.defaultBoth || field.defaultModified || null
	};

	if (typeof(field.type) == 'string')
	    fieldSaved.type = field.type;
	if (typeof(field.length) == 'number')
	    fieldSaved.length = field.length;
	if (typeof(field.key) == 'string') {
	    fieldSaved.key = field.key;
	    if (field.key == 'primary')
		model.primaryKey = fieldName;
	}
	if (field.required)
	    fieldSaved.required = field.required;
	if (field.validate)
	    fieldSaved.validate = defineValidate(orm, field.validate);
	if (field.default) {
	    if (field.default + '' == '[object Object]') {
		defaultValues.created = field.default.created || defaultValues.created;
		defaultValues.modified = field.default.modified || defaultValues.modified;
	    }
	    else if (field.default instanceof Array) {
		defaultValues.created = field.default[0] || defaultValues.created;
		defaultValues.modified = field.default[1] || defaultValues.created || defaultValues.modified;
	    }
	    else
		defaultValues.created = field.default;
	}
	fieldSaved.default = defaultValues;
	model.fields[fieldName] = fieldSaved;
    });

    if (options) {
	if (options.tableName)
	    model.table = options.tableName;
	model.createdAt = options.createdAt === undefined ? 'createdAt' : options.createdAt;
	model.modifiedAt = options.modifiedAt === undefined ? 'modifiedAt' : options.modifiedAt;
	hooksNames = ['beforeValidate', 'afterValidate', 'beforeCreate', 'afterCreate', 'beforeUpdate', 'afterUpdate', 'beforeSave', 'afterSave', 'beforeDelete', 'afterDelete', 'beforeFind', 'afterFind'];
	_.each(hooksNames, function(hook) {
	    if (options[hook])
		model[hook] = options[hook];
	});
    }

    orm.models[name] = model;
}

function addQueryMethods(model, orm) {
    var methods = {
	all: function(options, callback) {
	    selects.all(orm, model, options, callback);
	},
	allAsync: function(options) {
	    require('deprecate-me')({since: '0.7.0', removed: '1.0.0'});
	    return selects.allAsync(orm, model, options);
	},
	count: function(options, callback) {
	    selects.count(orm, model, options, callback);
	},
	countAsync: function(options) {
	    require('deprecate-me')({since: '0.7.0', removed: '1.0.0'});
	    return selects.countAsync(orm, model, options);
	},
	create: function(options, callback) {
	    inserts.create(orm, model, options, callback);
	},
	createAsync: function(options) {
	    require('deprecate-me')({since: '0.7.0', removed: '1.0.0'});
	    return inserts.createAsync(orm, model, options);
	},
	delete: function(options, callback) {
	    deletes.delete(orm, model, options, callback);
	},
	deleteAsync: function(options) {
	    require('deprecate-me')({since: '0.7.0', removed: '1.0.0'});
	    return deletes.deleteAsync(orm, model, options);
	},
	describe: function(callback) {
	    describes.describe(orm, model, callback);
	},
	describeAsync: function() {
	    require('deprecate-me')({since: '0.7.0', removed: '1.0.0'});
	    return describes.describeAsync(orm, model);
	},
	find: function(options, callback) {
	    selects.find(orm, model, options, callback);
	},
	findAsync: function(options) {
	    require('deprecate-me')({since: '0.7.0', removed: '1.0.0'});
	    return selects.findAsync(orm, model, options);
	},
	update: function(options, callback) {
	    updates.update(orm, model, options, callback);
	},
	updateAsync: function(options) {
	    require('deprecate-me')({since: '0.7.0', removed: '1.0.0'});
	    return updates.updateAsync(orm, model, options);
	}
    };
    _.each(methods, function(method, name) {
	model[name] = method;
    });
}
