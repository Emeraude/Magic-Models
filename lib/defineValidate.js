var _ = require('lodash');

module.exports = function(orm, rules) {
    var parsed = [];
    _.each(rules, function(config, name) {
	var rule = {name: name};
	if (orm.validate[name]) {
	    rule.fun = orm.validate[name];
	    if (config + '' == '[object Object]') {
		rule.val = config.val;
		if (config.msg)
		    rule.msg = config.msg;
	    }
	    else
		rule.val = config;
	    parsed.push(rule);
	}
	else {
	    if (config instanceof Function) {
		rule.fun = config;
		parsed.push(rule);
	    }
	    else {
		_.each(config, function(conf, name) {
		    if (name != 'msg') {
			var rule = {msg: config.msg,
				    name: name};
			if (orm.validate[name]) {
			    rule.fun = orm.validate[name];
			    rule.val = conf;
			}
			else if (conf instanceof Function)
			    rule.fun = conf;
			else
			    return ;
			parsed.push(rule);
		    }
		});
	    }
	}
    });
    return parsed;
}
