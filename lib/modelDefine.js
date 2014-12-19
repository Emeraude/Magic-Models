var _ = require('lodash');
var plural = require('plural');
var selects = require('./selects');
var inserts = require('./inserts');
var deletes = require('./deletes');
var updates = require('./updates');
var describes = require('./describes');
var hooks = require('./hooks');

module.exports.define = function(name, fields, options, orm) {
    /* TODO : manage fieldName for all selects : where/group/order*/
    var model = {
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
	    return selects.allAsync(orm, model, options);
	},
	count: function(options, callback) {
	    selects.count(orm, model, options, callback);
	},
	countAsync: function(options) {
	    return selects.countAsync(orm, model, options);
	},
	create: function(options, callback) {
	    inserts.create(orm, model, options, callback);
	},
	createAsync: function(options) {
	    return inserts.createAsync(orm, model, options);
	},
	delete: function(options, callback) {
	    deletes.delete(orm, model, options, callback);
	},
	deleteAsync: function(options) {
	    return deletes.deleteAsync(orm, model, options);
	},
	describe: function(callback) {
	    describes.describe(orm, model, options, callback);
	},
	describeAsync: function() {
	    return describes.describeAsync(orm, model, options);
	},
	find: function(options, callback) {
	    selects.find(orm, model, options, callback);
	},
	findAsync: function(options) {
	    return selects.findAsync(orm, model, options);
	},
	update: function(options, callback) {
	    updates.update(orm, model, options, callback);
	},
	updateAsync: function(options) {
	    return updates.updateAsync(orm, model, options);
	}
    };
    _.each(methods, function(method, name) {
	model[name] = method;
    });
}
