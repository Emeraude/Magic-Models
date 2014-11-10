var magic = function(config, callback) {
    var Client = require('mariasql');
    var util = require('util');
    var _ = require('lodash');
    var EventEmitter = require('events').EventEmitter;
    var c = new Client();
    var orm = new EventEmitter;
    var selects = require('./selects');
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
	var model = {
	    fields: {},
	    name: name,
	    table: name,
	    hasOne: {},
	    hasMany: {}
	};
	/* TODO : foreach fields to do some cool things */
	_.each(fields, function(field, i) {
	    if (!field.fieldName)
		field.fieldName = i;
	    model.fields[i] = field;
	});
	model.all = function(options, callback) {
	    if (callback == undefined) {
		callback = options;
		options = {};
	    }
	    selects.all(orm, model, options, callback);
	}
	model.find = function(options, callback) {
	    if (callback == undefined) {
		callback = options;
		options = {};
	    }
	    options.limit = 1;
	    selects.all(orm, model, options, callback);
	}
	model.count = function(options, callback) {
	    if (callback == undefined) {
		callback = options;
		options = {};
	    }
	    options.count = true;
	    selects.all(orm, model, options, callback);
	}
	orm.models[name] = model;
    }
    orm.client = c;
    return orm;
}

module.exports = magic;
