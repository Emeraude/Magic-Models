var _ = require('lodash');
var tools = require('./tools');

function select(orm, model, options, callback) {
    query = 'SELECT';
    if (options.count == true)
	query += ' COUNT(*) AS count';
    else {
	if (!options.fields)
	    options.fields = _.keys(model.fields);
	if (typeof(options.fields) == 'string')
	    options.fields = [options.fields];
	_.each(options.fields, function(where) {
	    if (model.fields[where])
		query += ' `' + orm.client.escape(model.fields[where].fieldName) + '` AS `' + orm.client.escape(where) + '`,';
	    else
		console.warn('Warning: `' + orm.client.escape(where) + '` field is not defined in the model `' + orm.client.escape(model.name) + '`');
	});
	query = query.substring(0, query.length - 1);
    }
    query += ' FROM `' + model.table + '`';
    if (options.where) {
	query += ' WHERE';
	tools.where(orm, options.where);
    }
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
	    query +=  order.match(/^DESC$/i) ? 'DESC,' : 'ASC,';
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
    if (callback == undefined) {
	callback = options;
	options = {};
    }
    if (type) {
	if (type == 'find')
	    options.limit = 1;
	else if (type == 'count')
	    options.count = true;
    }
    select(orm, model, options, callback);
}

module.exports.all = function(orm, model, options, callback) {
    typed(orm, model, options, callback);
}

module.exports.find = function(orm, model, options, callback) {
    typed(orm, model, options, callback, 'find');
}

module.exports.count = function(orm, model, options, callback) {
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
