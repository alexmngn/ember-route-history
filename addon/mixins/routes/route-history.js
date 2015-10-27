import Ember from 'ember';

export default Ember.Mixin.create({
	setCurrentRoute: Ember.on('activate', function () {
		this.get('routeHistory').setCurrentRoute(this);
	})
});
