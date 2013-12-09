exports.error = function(options) {
    return new Error(options);
};

var Error = function(options) {
    this._expected = options.expected;
    this._actual = options.actual;
    this._location = options.location;
};

Error.prototype.describe = function() {
    var locationDescription = this._location ? this._location.describe() + ":\n" : "";
    return locationDescription + "Expected " + this._expected + "\nbut got " + this._actual;
};
