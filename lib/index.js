module.exports = function(config) {
    var Client = require('mariasql');
    var uvrun = require('uvrun-12');
    var EventEmitter = require('events').EventEmitter;
    var orm = new EventEmitter;
    var models = require('./modelDefine');
    orm.models = {};
    orm.client = new Client();

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
	models.define(name, fields, options, orm);
    }

    return orm;
}
