import RouteHistoryService from 'ember-route-history/services/route-history';

export function initialize(application) {
	application.register('service:route-history', RouteHistoryService);
	application.inject('route', 'routeHistory', 'service:route-history');
}

export default {
	name: 'injectRouteHistory',
	after: 'ember-data',
	initialize: initialize
};
