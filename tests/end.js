exports.exit = function(test) {
    db.exit();
    test.done();
}
