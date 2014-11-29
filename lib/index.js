var magic = function(config) {
    var Client = require('mariasql');
    var uvrun = require('uvrun');
    var util = require('util');
    var _ = require('lodash');
    var plural = require('plural');
    var EventEmitter = require('events').EventEmitter;
    var orm = new EventEmitter;
    var selects = require('./selects');
    var inserts = require('./inserts');
    var deletes = require('./deletes');
    var updates = require('./updates');
    var describes = require('./describes');
    orm.models = {};
    orm.client = new Client();

    console.log = function(a) {
	console.info(util.inspect(a, {colors: true}));
    }

    orm.client.connect(config);
    orm.client.on('connect', function() {
	orm.emit('loaded');
    }).on('error', function(e) {
	orm.emit('error', e);
    });

    orm.validate = require('./validation');
    orm.modelsDir = function(dir) {
	require('./modelsDir')(dir, orm);
    }

    orm.query = function(query, callback) {
	orm.client.query(query)
	    .on('result', function(res) {
		var datas = [];
		res.on('row', function(row) {
		    datas.push(row);
		}).on('end', function(infos) {
		    infos.query = query;
		    callback(null, datas, infos);
		}).on('error', function(e) {
		    callback(e);
		});
	    });
    }

    orm.queryAsync = function(query) {
	var datas;
	orm.query(query, function(e, r, i) {
	    datas = {
		errors: e,
		rows: r,
		infos: i
	    };
	});
	while (!datas)
	    uvrun.runOnce();
	return datas;
    }

    orm.define = function(name, fields, options) {
	/* TODO : manage fieldName for all selects : where/group/order*/
	var model = {
	    fields: {},
	    name: name,
	    table: plural(name),
	    hasOne: {},
	    hasMany: {},
	    primaryKey: null,
	    createdAt: 'createdAt',
	    modifiedAt: 'modifiedAt',
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

	if (options) {
	    model.createdAt = options.createdAt === undefined ? 'createdAt' : options.createdAt;
	    model.modifiedAt = options.modifiedAt === undefined ? 'modifiedAt' : options.modifiedAt;
	}

	_.each(fields, function(field, i) {
	    var defaultValues = {};
	    defaultValues.created = field.defaultBoth || field.defaultCreated || null;
	    defaultValues.modified = field.defaultBoth || field.defaultModified || null;
	    delete field.defaultBoth;
	    delete field.defaultCreated;
	    delete field.defaultModified;
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
	    field.default = defaultValues;
	    if (!field.fieldName)
		field.fieldName = i;
	    if (field.key == 'primary')
		model.primaryKey = i;
	    model.fields[i] = field;
	});

	orm.models[name] = model;
    }

    return orm;
}

module.exports = magic;
