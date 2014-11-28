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
	var err, rows, infos;
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
	/* TODO : change table attribute (singular => plural) */
	/* TODO : manage fieldName for all selects : where/group/order*/
	var model = {
	    fields: {},
	    name: name,
	    table: plural(name),
	    hasOne: {},
	    hasMany: {},
	    all: function(options, callback) {
		selects.all(orm, model, options, callback);
	    },
	    count: function(options, callback) {
		selects.count(orm, model, options, callback);
	    },
	    create: function(options, callback) {
		inserts.create(orm, model, options, callback);
	    },
	    delete: function(options, callback) {
		deletes.delete(orm, model, options, callback);
	    },
	    describe: function(callback) {
		describes.describe(orm, model, options, callback);
	    },
	    find: function(options, callback) {
		selects.find(orm, model, options, callback);
	    },
	    update: function(options, callback) {
		updates.update(orm, model, options, callback);
	    }
	};
	/* TODO : foreach fields to do some cool things (validations rules, etc...) */
	_.each(fields, function(field, i) {
	    if (!field.fieldName)
		field.fieldName = i;
	    model.fields[i] = field;
	});

	orm.models[name] = model;
    }

    return orm;
}

module.exports = magic;
