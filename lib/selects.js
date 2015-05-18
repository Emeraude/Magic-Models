var _ = require('lodash');
var uvrun = require('uvrun-12');
var tools = require('./tools');
var where = require('./where');

function select(orm, model, options, callback) {
    var query = 'SELECT';
    if (options.count)
	query += ' COUNT(*) AS count';
    else {
	if (!options.fields)
	    options.fields = _.keys(model.fields);
	else if (typeof(options.fields) == 'string')
	    options.fields = [options.fields];
	_.each(options.fields, function(where) {
	    if (model.fields[where])
		query += ' `' + orm.client.escape(model.fields[where].fieldName) + '` AS `' + orm.client.escape(where) + '`,';
	});
	query = query.substring(0, query.length - 1);
    }
    query += ' FROM `' + model.table + '`';
    if (options.where)
	query += ' WHERE' + where(orm, options.where);
    if (options.group) {
	query += ' GROUP BY';
	if (typeof(options.group) == 'string')
	    options.group = [options.group];
	_.each(options.group, function(group) {
	    query += ' `' + orm.client.escape(group) + '`,';
	});
	query = query.substring(0, query.length - 1);
    }
    if (options.order) {
	query += ' ORDER BY';
	_.each(options.order, function(order, field) {
	    query += ' `' + orm.client.escape(field) + '` ';
	    query +=  order.match(/^desc$/i) ? 'DESC,' : 'ASC,';
	});
	query = query.substring(0, query.length - 1);
    }
    if (options.limit) {
	query += ' LIMIT ' + parseInt(options.limit);
	if (options.offset)
	    query += ' OFFSET ' + parseInt(options.offset);
    }
    orm.query(query, callback);
}

function typed(orm, model, options, callback, type) {
    if (options == undefined)
	options = {};
    if (type) {
	if (type == 'find')
	    options.limit = 1;
	else if (type == 'count')
	    options.count = true;
    }
    model.beforeFind(options, function(options) {
	select(orm, model, options, function(e, r, i) {
	    model.afterFind(e, r, i, callback);
	});
    });
}

module.exports.all = function(orm, model, options, callback) {
    if (typeof(options) == 'function') {
	callback = options;
	options = {};
    }
    typed(orm, model, options, callback);
}

module.exports.find = function(orm, model, options, callback) {
    if (typeof(options) == 'function') {
	callback = options;
	options = {};
    }
    function surcharged(errors, rows, infos) {
	if (rows && rows[0])
	    rows = rows[0];
	callback(errors, rows, infos);
    }
    typed(orm, model, options, surcharged, 'find');
}

module.exports.count = function(orm, model, options, callback) {
    if (typeof(options) == 'function') {
	callback = options;
	options = {};
    }
    function surcharged(errors, rows, infos) {
	var count = rows;
	if (rows) {
	    if (rows.length > 1) {
		count = [];
		_.each(rows, function(row) {
		    count.push(parseInt(row.count));
		});
	    }
	    else
		count = parseInt(rows[0].count);
	}
	callback(errors, count, infos);
    }
    typed(orm, model, options, surcharged, 'count');
}

function async(orm, model, values, method) {
    var datas;
    module.exports[method](orm, model, values, function(e, r, i) {
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

module.exports.allAsync = function(orm, model, values) {
    return async(orm, model, values, 'all');
}

module.exports.countAsync = function(orm, model, values) {
    return async(orm, model, values, 'count');
}
module.exports.findAsync = function(orm, model, values) {
    return async(orm, model, values, 'find');
}
