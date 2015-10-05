var specialChars = {
  '\0': '\\0',
  '\b': '\\b',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
  '\x1a': '\\Z'
};

function escaped(str) {
  return '"' + str.replace(/[\\'"\0\b\n\r\t\x1a]/g, function(s) {
    if (s.match(/^[\\'"]$/))
      return '\\' + s;
    else
      return specialChars[s];
  }) + '"';
}

function formatInt(i) {
  var s = i.toString();
  while (s.length < 2)
    s = '0' + s;
  return s;
}

module.exports = function(v) {
  switch (typeof v) {
  case 'number':
  case 'boolean':
    return v.toString();
    break;
  case 'string':
    return escaped(v);
    break;
  default:
    if (v instanceof Date)
      return v.getFullYear() + '-' + formatInt(v.getMonth() + 1) + '-' + formatInt(v.getDate()) + ' ' + formatInt(v.getHours()) + ':' + formatInt(v.getMinutes()) + ':' + formatInt(v.getSeconds());
    if (v instanceof RegExp)
      return module.exports(v.source);
    else if (v == null)
      return 'NULL';
    else
      throw new Error('Invalid type "' + typeof v + '". Availabe types are "number", "boolean", "string" or "date".');
  }
}

module.exports.fieldName = function(name) {
  return '`' + name.replace(/\`/g, '``') + '`';
}
