exports.is = function(args, cb) {
  cb((args.checkedField.val + '').match(args.rule.val) !== null);
}

exports.not = function(args, cb) {
  cb((args.checkedField.val + '').match(args.rule.val) === null);
}
