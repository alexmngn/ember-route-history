import Mixin from '@ember/object/mixin';
import { on } from '@ember/object/evented';

export default Mixin.create({
	setCurrentRoute: on('activate', function () {
		this.get('routeHistory').setCurrentRoute(this);
	})
});
