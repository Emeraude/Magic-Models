var magic = function(config, callback) {
    var Client = require('mariasql');
    var util = require('util');
    var _ = require('lodash');
    var EventEmitter = require('events').EventEmitter;
    var c = new Client();
    var orm = new EventEmitter;
    var selects = require('./selects');
    var inserts = require('./inserts');
    orm.models = {};

    console.log = function(a) {
	console.info(util.inspect(a, {colors: true}));
    }

    c.connect(config);
    c.on('connect', function() {
	orm.emit('loaded');
    }).on('error', function(e) {
	orm.emit('error', e);
    });

    orm.query = function(query, callback) {
	c.query(query)
	    .on('result', function(res) {
		var datas = [];
		res.on('row', function(row) {
		    datas.push(row);
		}).on('end', function(info) {
		    callback(null, datas);
		}).on('error', function(e) {
		    callback(e);
		});
	    });
    }

    orm.define = function(name, fields, options) {
	/* TODO : change table attribute (singular => plural) */
	/* TODO : manage fieldName for all selects : where/group/order*/
	var model = {
	    fields: {},
	    name: name,
	    table: name,
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
	    describe: function(callback) {
		orm.query('DESCRIBE ' + model.table, callback);
	    },
	    find: function(options, callback) {
		selects.find(orm, model, options, callback);
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
    orm.client = c;
    return orm;
}

module.exports = magic;
