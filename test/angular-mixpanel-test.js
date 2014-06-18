/*
 * angular-mixpanel
 *
 * Copyright (c) 2014 "kuhnza" David Kuhn
 * Licensed under the MIT license.
 * https://github.com/kuhnza/angular-mixpanel/blob/master/LICENSE
 */

'use strict';

describe('Provider: $mixpanelProvider', function () {

    var $window, $mixpanel;

    beforeEach(function () {
        // Initialize the service provider by injecting it to a fake module's config block
        angular.module('testApp', []);

        angular.module('analytics.mixpanel').config(function ($mixpanelProvider) {
            $mixpanel = $mixpanelProvider;
        });

        // Initialize myApp injector
        module('testApp', 'analytics.mixpanel');
    });

    beforeEach(inject(function (_$window_) {
        $window = _$window_;
    }));

    it('should set the API key', function () {
        var apiKey = 'abcd1234';

        $mixpanel.apiKey(apiKey);

        expect($mixpanel.apiKey()).toBe(apiKey);
    });

    it('should set super properties', function () {
        var properties = { prop1: true };

        $mixpanel.superProperties(properties);

        expect($mixpanel.superProperties()).toBe(properties);
    });

    it('should load', function () {
        var mp = $mixpanel.$get();

        expect(mp).toBeDefined();
        expect(mp.track).toBeDefined();
        expect(mp.register).toBeDefined();
        expect(mp.people).toBeDefined();
    });
});