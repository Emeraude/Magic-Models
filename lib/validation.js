module.exports = {
    is: function(value, rule) {
	return (value + '').match(rule);
    },
    required: function(value, rule) {
	return rule && value != undefined;
    },
    not: function(value, rule) {
	return !(value + '').match(rule);
    },
    isIn: function(value, rule) {
	for (i in rule)
	    if (rule[i] == value)
		return true;
	return false;
    },
    notIn: function(value, rule) {
	for (i in rule)
	    if (rule[i] == value)
		return false;
	return true;
    },
    len: function(value, rule) {
	var len = (value + '').length;
	return len >= rule[0] && len <= rule[1];
    },
    minLen: function(value, rule) {
	return (value + '').length >= rule;
    },
    maxLen: function(value, rule) {
	return (value + '').length <= rule;
    }
};
