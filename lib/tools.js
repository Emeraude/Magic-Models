var _ = require('lodash');

module.exports.escapeValue = function(orm, value) {
    return '"' + typeof(value) == 'string' ? orm.client.escape(value) : value + '"';
}

module.exports.validate = function(orm, model, data) {
    var errors = [];
    _.each(model.fields, function(field, fieldName) {
	if (field.validate) {
	    _.each(field.validate, function(config, rule) {
		if (orm.validate[rule]) {
		    if (Object.prototype.toString.call(config) == '[object Object]') {
			if (!orm.validate[rule](data[fieldName], config.val, data))
			    errors.push(config.msg);
		    }
		    else {
			if (!orm.validate[rule](data[fieldName], config, data))
			    errors.push('Rule "' + rule + '" for field `' + fieldName + '` has not been successfully validated.');
		    }
		}
		else {
		    if (config instanceof Function) {
			if (!config(data[fieldName], data, model))
			    errors.push('Rule "' + rule + '" for field `' + field.name + '` has not been successfully validated.');
		    }
		    else {
			_.each(config, function(value, rule) {
			    if (rule != 'msg') {
				if (orm.validate[rule]) {
				    if (!orm.validate[rule](data[fieldName], value, data))
					errors.push(config.msg);
				}
				else {
				    if (value instanceof Function) {
					if (value(data[fieldName], data, model))
					    errors.push(config.msg);
				    }
				}
			    }
			});
		    }
		}
	    });
	}
    });
    console.log(errors);
    return errors;
}
