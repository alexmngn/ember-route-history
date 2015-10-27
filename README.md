# Ember-route-history [![Build Status](https://travis-ci.org/4lex-io/ember-route-history.png?branch=master)](https://travis-ci.org/4lex-io/ember-route-history)

This is an Ember-CLI addon. It provides a service which keeps an history of the visited routes. You will be able to know what is the current route, and what was the previously visited routes.

## Installation

Using ember-cli:

```
ember install ember-route-history
```

## Usage

By default, **the service is injected into all routes of your application**. You can also inject it in any controllers, components or other services.

**You need to extend the `RouteHistoryMixin` in the routes you would like to keep an history of.** If you don't use this mixin in a certain route, it won't be tracked.

If you don't want to add this mixin for all your routes, you can simply create a base route that will extend this mixin, then you can extend your base route on all the routes of your application.

```
import Ember from 'ember';
import RouteHistoryMixin from 'ember-route-history/mixins/routes/route-history';

export default Ember.Route.extend(RouteHistoryMixin, {
    /* Your code here */
});
```

To use it, in a component for example:

```
export default Ember.Component.extend({
    routeHistory: Ember.inject.service(),

    onInsert: Ember.on('didInsertElement', function () {
        const currentRouteName = this.get('routeHistory.current'); //Returns the current route name.
        const previousRouteNames = this.get('routeHistory.history'); //Returns an array of route names.
    }
});
```
