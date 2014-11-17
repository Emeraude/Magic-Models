var rules = {};

rules.is = function(value, rule) {
    return (value + '').match(rule);
}

rules.required = function(value, rule) {
    return rule && value != undefined;
}

module.exports = rules;
