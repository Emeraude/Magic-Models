var beforeQuery = ['beforeValidate', 'afterValidate', 'beforeCreate', 'beforeSave', 'beforeUpdate', 'beforeDelete', 'beforeFind'];
var afterQuery = ['afterCreate', 'afterSave', 'afterUpdate', 'afterDelete', 'afterFind'];

for (i in beforeQuery) {
    module.exports[beforeQuery[i]] = function(datas, callback) {
	callback(datas);
    }
}

for (i in afterQuery) {
    module.exports[afterQuery[i]] = function(errors, rows, infos, callback) {
	callback(errors, rows, infos);
    }
}
