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
	;// TODO
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
    }
};
