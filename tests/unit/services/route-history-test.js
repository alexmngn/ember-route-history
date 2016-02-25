/**
 * Route History Service Unit Test
 */

import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor('service:route-history', 'Unit - Service - Route History Service', {
	setup: function () {
		this.subject().set('routeHistory', Ember.A());
	},
	teardown: function () {
	}
});


test('Service add a route to the route history', function (assert) {
	assert.expect(2);
	const subject = this.subject();

	assert.ok(subject.get('routeHistory.length') === 0, 'History is empty by default');

	subject.addRouteToHistory('posts', 1);
	subject.addRouteToHistory('comments', 2);

	assert.ok(subject.get('routeHistory.length') === 2, 'History has 2 entries after adding 2 routes');

});

test('Service set the current route properly', function (assert) {
	assert.expect(4);

	const subject = this.subject();
	const route = Ember.Object.create({});

	route.set('routeName', 'loading');
	route.set('modelFor', function() { 
    return Ember.Object.create({}); 
  });
	subject.setCurrentRoute(route);

	assert.equal(subject.get('current'), null, 'The service doesn\'t keep track of the loading route');

	route.set('routeName', 'posts');
	route.set('modelFor', function() { 
    return Ember.Object.create({
      id: 1
    }); 
  });
	subject.setCurrentRoute(route);

	assert.ok(subject.get('currentRouteName') === 'posts', 'The current route is now set to "post"');
	assert.ok(subject.get('currentRouteID') === 1,         'The current route stores current post_id');

	assert.ok(subject.get('routeHistory.length') === 1, 'History has 1 entry after setting the current route to "post"');
});

test('Service can load previous route properly', function (assert) {
	assert.expect(7);

	const subject = this.subject();
	const route = Ember.Object.create({});

	route.set('routeName', 'firstRoute');
	route.set('modelFor', function() {
    return Ember.Object.create({
      id: 1
    });
  });
	subject.setCurrentRoute(route);
	assert.ok(subject.get('previous') === null, 'The previous route does not exist.');

	route.set('routeName', 'secondRoute');
	route.set('modelFor', function() { 
    return Ember.Object.create({}); 
  });
	subject.setCurrentRoute(route);

	assert.ok(subject.get('previous') === 'firstRoute',          'The previous route name is "firstRoute"');
	assert.ok(subject.get('previousRouteName') === 'firstRoute', 'The previous route name is "firstRoute"');
	assert.ok(subject.get('previousRouteID') === 1,              'The previous route id is 1');

	route.set('routeName', 'thirdRoute');
	subject.setCurrentRoute(route);

	assert.ok(subject.get('previous') === 'secondRoute', 'The previous route name is "secondRoute"');
	assert.ok(subject.get('previousRouteName') === 'secondRoute', 'The previous route name is "secondRoute"');
	assert.ok(subject.get('previousRouteID') === null,            'The previous route id is null');
});

test('Service doesn\'t go higher than the maxLength', function (assert) {
	assert.expect(7);

	const subject = this.subject();
	const route = Ember.Object.create({});
	route.set('modelFor', function() { 
    return Ember.Object.create({
      id: null
    }); 
  });

	subject.set('maxHistoryLength', 2);

	route.set('routeName', 'posts');
	subject.setCurrentRoute(route);
	route.set('routeName', 'comments');
	subject.setCurrentRoute(route);
	route.set('routeName', 'accounts');
	subject.setCurrentRoute(route);
	route.set('routeName', 'home');
	subject.setCurrentRoute(route);

	const routeHistory = subject.get('routeHistory');

	assert.ok(routeHistory.get('length') === 2, 'History has 2 entries after adding 4 routes');

	assert.ok(routeHistory.objectAt(0).name === 'accounts', 'History is properly saved with accounts route name');
	assert.ok(routeHistory.objectAt(0).id === null, 'History is properly saved with accounts route id');

	assert.ok(routeHistory.objectAt(1).name === 'home', 'History is properly saved with home route name');
	assert.ok(routeHistory.objectAt(1).id === null, 'History is properly saved with home route id');

	const history = subject.get('history');

	assert.ok(history.get('length') === 2, 'History backwards compat. is valid');
	assert.ok(history.objectAt(0) === 'accounts' && history.objectAt(1) === 'home', 'History backwards compat is valid with routes.');
});
