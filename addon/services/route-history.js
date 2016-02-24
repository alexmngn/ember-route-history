/**
 * Route History Service
 * This service keeps track of the current route and the previous route state.
 *
 * @module ember-route-history/services/route-history
 * @extends Ember.Service
 */

import Ember from 'ember';

const { computed } = Ember;

export default Ember.Service.extend({

  /**
   * Maintains backwards compatibility with previous interface
   *
   * @property current
   * @type {String}
   */
	current: Ember.computed.alias("currentRouteName"),

	/**
	 * Current route name
	 *
	 * @property current
	 * @type {String}
	 */
	currentRouteName: Ember.computed("currentRoute.name", function() {
    if(this.get("currentRoute.name")) {
      return this.get("currentRoute.name");
    } else {
      return null;
    }
  }),

	/**
	 * Current route id
	 *
	 * @property current
	 * @type number 
	 */
	currentRouteID: Ember.computed("currentRoute.id", function() {
    if(this.get("currentRoute.id")) {
      return this.get("currentRoute.id");
    } else {
      return null;
    }
  }),

	/**
	 * Current route
	 *
	 * @property current
	 * @type {Object}
	 */
	currentRoute: computed("routeHistory.[]", function() {
    if(this.get("history.length") > 0) {
      return this.get("history")[0];
    } else {
      return {};
    }
  }),

  /**
   * Maintains backwards compatibility with previous interface
   *
   * @property previous
   * @type {String}
   */
  previous: computed.alias("previousRouteName"),

  /**
   * Gets the previous route object from the routeHistory stack
   *
   * @property previousRouteObject
   * @type {Object}
   */
  previousRouteObject: computed("routeHistory.[]", function() {
		const history = this.get('routeHistory');
		const historyLength = history.get('length');

		if(!Ember.isEmpty(history) && historyLength > 1) {
			return history.objectAt(historyLength - 2); 
    } else {
      return {};
    }
  }),

	/**
	 * Previous route name. If there is no previous route, returns null
	 *
	 * @property previous
	 * @type {String}
	 */
	previousRouteName: computed('previousRouteObject.name', function() {
		if (this.get("previousRouteObject.name")) {
      return this.get("previousRouteObject.name");
		}

		return null;
	}),

	/**
	 * Previous route ID. If there is no previous route, returns null
	 *
	 * @property previous
	 * @type number
	 */
	previousRouteID: computed('previousRouteObject.id', function() {
		if (this.get("previousRouteObject.id")) {
      return this.get("previousRouteObject.id");
		}

		return null;
	}),

	/**
	 * Array contening the history of routes that have been visited.
	 *
	 * @property routeHistory
	 * @type {Array}
	 */
	routeHistory: Ember.A(),

  /**
   * Maintains backwards compatibility with previous interface
   *
   * @property history
   * @type {Ember.A}
   */
	history: computed('routeHistory', function() {
    return Ember.A(this.get("routeHistory").map(function(historyItem) {
      return historyItem.name;
    }));
  }),

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
	 * @method pushHistoryState
	 * @param routeName
	 * @return The current history stack.
	 */
	addRouteToHistory(routeName, routeID=null) {
		const maxHistoryLength = this.get('maxHistoryLength');
		let history = this.get('routeHistory');

		history.pushObject(Ember.Object.create({
      name: routeName,
      id:   routeID
    }));

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
    let routeID     = null;

    if(route.modelFor(routeName)) {
      routeID = route.modelFor(routeName).get('id');
    }

		if (routeName !== 'loading') {
			this.set('currentRoute', {
        name: routeName,
        id:   routeID
      });
			this.addRouteToHistory(routeName, routeID);
		}
	}
});
