var test = require('tape'),
	sinon = require('sinon'),
	EmitterScopeRelay = require('./');

test('structure and inheritance', function (t) {
	var esr = new EmitterScopeRelay();

	t.plan(4);

	t.true(esr.on, 'EventEmitter.on should exist');
	t.true(esr.emit, 'EventEmitter.emit should exist');

	t.true(esr.relay, 'EmitterScopeRelay.relay should exist');
	t.true(esr.to, 'EmitterScopeRelay.to should exist');

	t.end();
});

test('relay()', function (t) {
	var esr = new EmitterScopeRelay();

	test('should add a listener', function (t) {
		esr.relay('someEvent');

		t.plan(1);

		t.equal(1, esr.listeners('someEvent').length);

		t.end();
	});

	test('should support chaining', function (t) {
		esr.relay('someOtherEvent').relay('someThirdEvent');

		t.plan(2);

		t.equal(1, esr.listeners('someOtherEvent').length);
		t.equal(1, esr.listeners('someThirdEvent').length);

		t.end();
	});

	t.end();

});

test('to()', function (t) {
	var esr = new EmitterScopeRelay(),
		scope = {};
	esr.to(scope);

	t.plan(1);

	t.equal(esr.scope, scope, 'scope assignment should work');

	t.end();
});

test('event relay', function (t) {
	var esr = new EmitterScopeRelay(),
		scope = {
			$emit: function () {
			},
			$broadcast: function () {
			}
		},
		arg = {};
	sinon.spy(scope, '$emit');
	sinon.spy(scope, '$broadcast');

	esr.relay('someEvent')
		.relay('someOtherEvent')
		.relay('someThirdEvent', true)
		.to(scope);

	t.plan(4);

	esr.emit('someEvent');
	t.true(scope.$emit.calledOnce, 'scope.$emit should have been called once');

	esr.emit('someOtherEvent');
	t.true(scope.$emit.calledTwice, 'scope.$emit should have been called twice');

	esr.emit('someThirdEvent');
	t.true(scope.$broadcast.calledOnce, 'scope.$broadcast should have been called once');

	esr.emit('someEvent', arg);
	t.true(scope.$emit.calledWith('someEvent', arg), 'scope.$emit should have been called with proper args');

	t.end();
});
