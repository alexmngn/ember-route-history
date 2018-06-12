/**
 * Route History Service
 * This service keeps track of the current route and the previous route state.
 *
 * @module ember-route-history/services/route-history
 * @extends Ember.Service
 */

import Service from '@ember/service';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default Service.extend({

	/**
	 * Current route
	 *
	 * @property current
	 * @type {String}
	 */
	current: '',

	/**
	 * Previous route. If there is no previous route, returns null
	 *
	 * @property previous
	 * @type {String}
	 */
	previous: computed('history.[]', function() {
		const history = this.get('history');
		const historyLength = history.get('length');

		if (!isEmpty(history) && historyLength > 1) {
			return history.objectAt(historyLength - 2);
		}

		return null;
	}),

	/**
	 * Array contening the history of routes that have been visited.
	 *
	 * @property history
	 * @type {Array}
	 */
	history: A(),

	/**
	 * Maximum number of entries to keep in the history.
	 *
	 * @property maxHistoryLength
	 * @type number
	 */
	maxHistoryLength: 10,

	/**
	 * Pushes a route name onto the history stack.
	 *
	 * @method addRouteToHistory
	 * @param routeName
	 * @return The current history stack.
	 */
	addRouteToHistory(routeName, params) {
		const maxHistoryLength = this.get('maxHistoryLength');
		let history = this.get('history');

		history.pushObject([routeName, params]);

		if (history.get('length') > maxHistoryLength) {
			history.shiftObject();
		}

		return history;
	},

	/**
	 * @method setCurrentRoute
	 * @param route
	 */
	setCurrentRoute(route) {
		const routeName = route.get('routeName');
		if (routeName !== 'loading') {
			this.set('current', [routeName, route.paramsFor(routeName)]);
			this.addRouteToHistory(routeName, route.paramsFor(routeName));
		}
	}
});
