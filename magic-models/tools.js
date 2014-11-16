module.exports.escapeValue = function(orm, value) {
    if (typeof(value) == 'string')
	return '"' + orm.client.escape(value) + '"';
    else
	return '"' + value + '"';
}
