var uvrun = require('uvrun');

function parseDate(toParse) {
    if (!(toParse instanceof Date)) {
	var date = (toParse + '').split('-');
	return new Date(parseInt(date[0]), parseInt(date[1] - 1), parseInt(date[2]));
    }
    return toParse;
}

module.exports = {
    is: function(args) {
	return (args.checkedField.val + '').match(args.rule.val);
    },
    required: function(args) {
	if (args.rule.val)
	    return args.checkedField.val != undefined;
	return true;
    },
    not: function(args) {
	return !(args.checkedField.val + '').match(args.rule.val);
    },
    isIPv4: function(args) {
	if (args.rule.val)
	    return (args.checkedField.val + '').match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
	return true;
    },
    isIPv6: function(args) {
	if (args.rule.val)
	    return (args.checkedField.val + '').match(/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/i);
	return true;
    },
    isIP: function(args) {
	if (args.rule.val)
	    return (args.checkedField.val + '').match(/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/i) || (args.checkedField.val + '').match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
	return true;
    },
    isIn: function(args) {
	for (i in args.rule.val)
	    if (args.rule.val[i] == args.checkedField.val)
		return true;
	return false;
    },
    notIn: function(args) {
	for (i in args.rule.val)
	    if (args.rule.val[i] == args.checkedField.val)
		return false;
	return true;
    },
    isUnique: function(args) {
	if (!args.rule.val)
	    return true;
	var where = {};
	where[args.checkedField.name] = args.checkedField.val;
	var count = args.model.countAsync({where: where});
	return count.rows == 0;
    },
    len: function(args) {
	var len = (args.checkedField.val + '').length;
	return len >= args.rule.val[0] && len <= args.rule.val[1];
    },
    minLen: function(args) {
	return (args.checkedField.val + '').length >= args.rule.val;
    },
    maxLen: function(args) {
	return (args.checkedField.val + '').length <= args.rule.val;
    },
    between: function(args) {
	var val = parseInt(args.checkedField.val);
	return val >= args.rule.val[0] && val <= args.rule.val[1];
    },
    min: function(args) {
	return parseInt(args.checkedField.val) >= args.rule.val;
    },
    max: function(args) {
	return parseInt(args.checkedField.val) <= args.rule.val;
    },
    isAfter: function(args) {
	return parseDate(args.rule.val) <= parseDate(args.checkedField.val);
    },
    isBefore: function(args) {
	return parseDate(args.rule.val) >= parseDate(args.checkedField.val);
    },
    isBetween: function(args) {
	var val = parseDate(args.checkedField.val);
	return parseDate(args.rule.val[0]) <= val && parseDate(args.rule.val[1]) >= val;
    },
    isUrl: function(args) {
	return (args.checkedField.val + '').match(/(nfs|sftp|ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/);
    }
};
