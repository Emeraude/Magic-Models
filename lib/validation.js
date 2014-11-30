var uvrun = require('uvrun');

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
	var where = {};
	where[args.checkedField.name] = args.checkedField.val;
	var count = args.model.countAsync({where: where});
	if (args.rule.val)
	    return count.rows == 0;
	return true;
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
    isUrl: function(args) {
	return (args.checkedField.val + '').match(/(nfs|sftp|ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/);
    }
};
