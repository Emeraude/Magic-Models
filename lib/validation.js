function parseDate(toParse) {
    if (!(toParse instanceof Date)) {
	var date = (toParse + '').split('-');
	return new Date(parseInt(date[0]), parseInt(date[1] - 1), parseInt(date[2]));
    }
    return toParse;
}

module.exports = {
    is: function(args, cb) {
	cb((args.checkedField.val + '').match(args.rule.val));
    },
    required: function(args, cb) {
	require('deprecate-me')({since: '0.7.0', removed: '1.0.0', message: 'You should use the `required` attribute instead'});
	if (args.rule.val)
	    cb(args.checkedField.val != undefined);
	else
	    cb(true);
    },
    not: function(args, cb) {
	cb(!(args.checkedField.val + '').match(args.rule.val));
    },
    isIPv4: function(args, cb) {
	if (args.rule.val)
	    cb((args.checkedField.val + '').match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/));
	else
	    cb(true);
    },
    isIPv6: function(args, cb) {
	if (args.rule.val)
	    cb((args.checkedField.val + '').match(/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/i));
	else
	    cb(true);
    },
    isIP: function(args, cb) {
	if (args.rule.val)
	    cb((args.checkedField.val + '').match(/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/i) || (args.checkedField.val + '').match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/));
	else
	    cb(true);
    },
    isIn: function(args, cb) {
	for (i in args.rule.val)
	    if (args.rule.val[i] == args.checkedField.val)
		return cb(true);
	cb(false);
    },
    notIn: function(args, cb) {
	for (i in args.rule.val)
	    if (args.rule.val[i] == args.checkedField.val)
		return cb(false);
	cb(true);
    },
    isUnique: function(args, cb) {
	if (!args.rule.val)
	    return cb(true);
	var where = {};
	where[args.checkedField.name] = args.checkedField.val;
	args.model.count({where: where}, function(e, r, i) {
	    cb(r == 0);
	});
    },
    len: function(args, cb) {
	var len = (args.checkedField.val + '').length;
	cb(len >= args.rule.val[0] && len <= args.rule.val[1]);
    },
    minLen: function(args, cb) {
	cb((args.checkedField.val + '').length >= args.rule.val);
    },
    maxLen: function(args, cb) {
	cb((args.checkedField.val + '').length <= args.rule.val);
    },
    between: function(args, cb) {
	var val = parseInt(args.checkedField.val);
	cb(val >= args.rule.val[0] && val <= args.rule.val[1]);
    },
    min: function(args, cb) {
	cb(parseInt(args.checkedField.val) >= args.rule.val);
    },
    max: function(args, cb) {
	cb(parseInt(args.checkedField.val) <= args.rule.val);
    },
    isAfter: function(args, cb) {
	cb(parseDate(args.rule.val) <= parseDate(args.checkedField.val));
    },
    isBefore: function(args, cb) {
	cb(parseDate(args.rule.val) >= parseDate(args.checkedField.val));
    },
    isBetween: function(args, cb) {
	var val = parseDate(args.checkedField.val);
	cb(parseDate(args.rule.val[0]) <= val && parseDate(args.rule.val[1]) >= val);
    },
    isUrl: function(args, cb) {
	if (args.rule.val)
	    cb((args.checkedField.val + '').match(/(nfs|sftp|ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/));
	else
	    cb(true);
    }
};
