/**
 * Route History Service Unit Test
 */

import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor('service:route-history', 'Unit - Service - Route History Service', {
	setup: function () {
		this.subject().set('history', Ember.A());
	},
	teardown: function () {
	}
});


test('Service add a route to the history', function (assert) {
	assert.expect(2);
	const subject = this.subject();

	assert.ok(subject.get('history.length') === 0, 'History is empty by default');

	subject.addRouteToHistory('posts');
	subject.addRouteToHistory('comments');

	assert.ok(subject.get('history.length') === 2, 'History has 2 entries after adding 2 routes');

});

test('Service set the current route properly', function (assert) {
	assert.expect(3);

	const subject = this.subject();
	const route = Ember.Object.create({});

	route.set('routeName', 'loading');
	subject.setCurrentRoute(route);

	assert.ok(subject.get('current') === '', 'The service doesn\'t keep track of the loading route');

	route.set('routeName', 'posts');
	subject.setCurrentRoute(route);

	assert.ok(subject.get('current') === 'posts', 'The current route is now set to "post"');
	assert.ok(subject.get('history.length') === 1, 'History has 1 entry after setting the current route to "post"');
});

test('Service doesn\'t go higher than the maxLength', function (assert) {
	assert.expect(2);

	const subject = this.subject();
	const route = Ember.Object.create({});

	subject.set('maxHistoryLength', 2);

	route.set('routeName', 'posts');
	subject.setCurrentRoute(route);
	route.set('routeName', 'comments');
	subject.setCurrentRoute(route);
	route.set('routeName', 'accounts');
	subject.setCurrentRoute(route);
	route.set('routeName', 'home');
	subject.setCurrentRoute(route);

	const history = subject.get('history');

	assert.ok(history.get('length') === 2, 'History has 2 entries after adding 4 routes');
	assert.ok(history.objectAt(0) === 'accounts' && history.objectAt(1) === 'home', 'History is properly saved');
});
