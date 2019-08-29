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
	addRouteToHistory(routeName) {
		const maxHistoryLength = this.get('maxHistoryLength');
		let history = this.get('history');

		history.pushObject(routeName);

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

    // get all params for this route, this includes both ids passed and query params
    const allParams = route.paramsFor(`${routeName}`);

    // Create an object to house the extracted query params
    const queryParams = {};

    // Create an object to house all extracted ids
    const ids = {};

    // let's loop through all params and figure out if they belong in the ids object or in the queryParams object
    for (let key in allParams) {
      if (route.get('queryParams')[`${key}`]) {
        // we found this param defined in the routes query params
        // save to the queryParams object (but only if a value is not undefined)
        if (typeof allParams[`${key}`] !== "undefined") {
          queryParams[`${key}`] = allParams[`${key}`];
        }
      } else {
        // this param was not found in the query params object
        // save to the ids object
        ids[`${key}`] = allParams[`${key}`];
      }
    }

		if (routeName !== 'loading') {
			this.set('current', routeName);
      // we want to save the route name as well as any query params or ids this route may have
			this.addRouteToHistory({
        routeName,
        queryParams,
        ids
      });
		}
	}
});
