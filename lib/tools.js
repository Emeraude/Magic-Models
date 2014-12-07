var _ = require('lodash');
var comparisonOp = {
    'gt': '>',
    'gte': '>=',
    'lt': '<',
    'lte': '<=',
    'ne': '!=',
    'eq': '=',
    'not': 'NOT',
    'like': 'LIKE'
};

module.exports.escapeValue = function(orm, value) {
    return '"' + (typeof(value) == 'string' ? orm.client.escape(value) : value + '') + '"';
}

module.exports.where = function(orm, conditions) {
    var tools = this;
    _.each(conditions, function(value, field) {
	if (field.match(/^or$/i)) {
	    query += ' (';
	    _.each(value, function(val, i) {
		query += ' (';
		tools.where(orm, val);
		query += ' )';
		for (key in value);
		if (i != key)
		    query += ' OR ';
	    });
	    query += ' )';
	}
	else {
	    if (typeof(value) != 'object')
		query += ' `' + field + '` = "' + orm.client.escape(value + '') + '"';
	    else if (value instanceof Array) {
		query += ' `' + field + '` IN (';
		_.each(value, function(val, i) {
		    query += tools.escapeValue(orm, val);
		    for (key in val);
		    if (i != key)
			query += ',';
		});
		query += ')';
	    }
	    else {
		_.each(value, function(val, condition) {
		    if (comparisonOp[condition])
			query += ' `' + field + '` ' + comparisonOp[condition] + ' ' + tools.escapeValue(orm, val);
		    else if (condition == 'between')
			query += ' `' + field + '` BETWEEN ' + tools.escapeValue(orm, val[0]) + ' AND ' + tools.escapeValue(orm, val[1]);
		    else if (condition == 'match') {
			if (val instanceof RegExp) {
			    val += '';
			    val = val.substring(1, val.length - 1 - (val[val.length - 1] != '/'))
			}
			query += ' `' + field + '` REGEXP ' + tools.escapeValue(orm, val);
		    }
		    for (key in value);
		    if (condition != key)
			query += ' AND';
		})
	    }
	    for (key in conditions);
	    if (field != key)
		query += ' AND';
	}
    });
}

module.exports.validate = function(orm, model, data) {
    var errors = [];
    _.each(model.fields, function(field, fieldName) {
	if (field.validate) {
	    _.each(field.validate, function(config, rule) {
		var validationArgs = {
		    data: data,
		    model: model,
		    checkedField: {
			name: fieldName,
			val: data[fieldName]
		    }
		};
		if (orm.validate[rule]) {
		    validationArgs.rule = {
			name: rule
		    };
		    /* rule: {val, msg} | type 1 */
		    if (config + '' == '[object Object]') {
			validationArgs.rule.val = config.val;
			validationArgs.type = 1;
			if (!orm.validate[rule](validationArgs))
			    errors.push(config.msg);
		    }
		    /* rule: val | type 2 */
		    else {
			validationArgs.type = 2;
			validationArgs.rule.val = config;
			if (!orm.validate[rule](validationArgs))
			    errors.push('Rule "' + rule + '" for field `' + fieldName + '` has not been successfully validated.');
		    }
		}
		else {
		    /* rule: function | type 3 */
		    if (config instanceof Function) {
			validationArgs.rule = {
			    name: rule,
			    val: config
			}
			validationArgs.type = 3;
			if (!config(validationArgs))
			    errors.push('Rule "' + rule + '" for field `' + field.name + '` has not been successfully validated.');
		    }
		    else {
			/* rule: {rule1, rule2, msg} */
			_.each(config, function(value, rule) {
			    if (rule != 'msg') {
				var args = validationArgs;
				args.rule = {
				    name: rule,
				    val: value
				};
				/* rule: val | type 4 */
				if (orm.validate[rule]) {
				    args.type = 4;
				    if (!orm.validate[rule](args)) {
					errors.push(config.msg);
					return false;
				    }
				}
				/* rule: function | type 5 */
				else {
				    args.type = 5;
				    if (value instanceof Function) {
					if (!value(args)) {
					    errors.push(config.msg);
					    return false;
					}
				    }
				}
			    }
			});
		    }
		}
	    });
	}
    });
    return errors;
}
