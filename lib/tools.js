var _ = require('lodash');
var each = require('each');

module.exports.escapeValue = function(orm, value) {
    return '"' + (typeof(value) == 'string' ? orm.client.escape(value) : value + '') + '"';
}

module.exports.validate = function(orm, model, data, callback) {
    var errors = [];
    var remaining = _.size(model.fields);
    each(model.fields)
	.on('item', function(fieldName, field, cb) {
	    if (field.validate) {
		each(field.validate)
		    .on('item', function(rule, i, cb) {
			message = rule.msg || 'Rule "' + rule.name + '" for field `' + fieldName + '` has not been successfully validated.';
			rule.fun({
			    data: data,
			    model: model,
			    checkedField: {
				name: fieldName,
				val: data[fieldName]
			    },
			    rule: {
				name: rule.name,
				val: rule.val
			    },
			    msg: message
			}, function(check) {
			    if (!check)
				errors.push(message);
			    cb();
			});
		    })
		    .on('end', function() {
			cb();
		    });
	    }
	    else
		cb();
	})
	.on('end', function() {
	    if (errors.length > 0)
		callback(undefined, errors);
	    else
		callback(true);
	});
}
