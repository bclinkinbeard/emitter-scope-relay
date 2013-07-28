var util = require('util'),
	events = require('events');

function EmitterScopeRelay() {
	events.EventEmitter.call(this);

	this.relay = function (event, broadcast) {
		var self = this;
		this.on(event, function () {
			var f = broadcast ? self.scope.$broadcast : self.scope.$emit,
				args = Array.prototype.slice.call(arguments);

			f.apply(self.scope, [event].concat(args));
		});
		return this;
	};

	this.to = function (scope) {
		this.scope = scope;
	};
}

util.inherits(EmitterScopeRelay, events.EventEmitter);

module.exports = EmitterScopeRelay;
