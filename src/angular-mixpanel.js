/*
 * angular-mixpanel
 *
 * Copyright (c) 2014 "kuhnza" David Kuhn
 * Licensed under the MIT license.
 * https://github.com/kuhnza/angular-mixpanel/blob/master/LICENSE
 */

'use strict';

/**
 * Wraps the mixpanel JavaScript global to make it injectable and aid in testing.
 * Requires an injectable mixpanelApiKey to be present. This can be easily done
 * by configuring the module like so:
 *
 *    angular.module('analytics.mixpanel')
 *        .config(['$mixpanelProvider', function($mixpanelProvider) {
 *            $mixpanelProvider.setApiKey('<the key>');
 *        }]);
 */
angular.module('analytics.mixpanel', [])
    .provider('$mixpanel', function () {
        var apiKey, superProperties;

        /**
         * Init the mixpanel global
         */
        function init() {
            if (!Object.prototype.hasOwnProperty.call(window, 'mixpanel')) {
                throw 'Global `mixpanel` not available. Did you forget to include the library on the page?';
            }

            mixpanel.init(apiKey);

            waitTillAsyncApiLoaded(function () {
                if (superProperties) mixpanel.register(superProperties);
            });
        }

        /**
         * Wait till the async portion of the Mixpanel lib has loaded otherwise we'll end up passing back a reference
         * to a bare JS array which won't actually track anything when called.
         *
         * @param callback to be called once the API has finished loading
         */
        function waitTillAsyncApiLoaded(callback) {
            if (!Object.prototype.hasOwnProperty.call(window, 'mixpanel') || (window.mixpanel['__loaded'] === undefined)) {
                setTimeout(function () {
                    waitTillAsyncApiLoaded(callback);
                }, 500);
            }

            callback();
        }

        /**
         * Perform a dynamic call to the specified mixpanel function against the window.mixpanel object.
         *
         * @param name the mixpanel function name. Can be dot separated to specify sub-property functions
         * @returns {Function} a function that will lookup and dispatch a call to the window.mixpanel object
         */
        function callMixpanelFn(name) {
            return function () {
                var fn = window.mixpanel,
                    parts = name.split('.'),
                    scope, i;

                for (i = 0; i < parts.length; i++) {
                    scope = fn;
                    fn = fn[parts[i]];
                }

                return fn.apply(scope, arguments);
            }
        }

        /**
         * Get or set the Mixpanel API key. This can be done via a provider config.
         *
         * @param key your Mixpanel API key
         */
        this.apiKey = function (key) {
            if (!key) return apiKey;

            apiKey = key;
        };

        /**
         * Get or set a special set of properties to include/send with every event.
         *
         * @param properties a map properties
         *
         * @see https://mixpanel.com/help/reference/javascript#super-properties
         */
        this.superProperties = function (properties) {
            if (!properties) return superProperties;

            superProperties = properties;
        };

        this.$get = function () {
            init();

            // This is a bit of a gross hack but here we dynamically call the mixpanel functions against the
            // window.mixpanel object as we can't be sure when the window reference will be updated.
            return {
                init: callMixpanelFn('init'),
                push: callMixpanelFn('push'),
                disable: callMixpanelFn('disable'),
                track: callMixpanelFn('track'),
                track_links: callMixpanelFn('track_links'),
                track_forms: callMixpanelFn('track_forms'),
                register: callMixpanelFn('register'),
                register_once: callMixpanelFn('register_once'),
                unregister: callMixpanelFn('unregister'),
                identify: callMixpanelFn('identify'),
                get_distinct_id: callMixpanelFn('get_distinct_id'),
                alias: callMixpanelFn('alias'),
                set_config: callMixpanelFn('set_config'),
                get_config: callMixpanelFn('get_config'),
                get_property: callMixpanelFn('get_property'),
                people: {
                    set: callMixpanelFn('people.set'),
                    set_once: callMixpanelFn('people.set_once'),
                    increment: callMixpanelFn('people.increment'),
                    append: callMixpanelFn('people.append'),
                    track_charge: callMixpanelFn('people.track_charge'),
                    clear_charges: callMixpanelFn('people.clear_charges'),
                    delete_user: callMixpanelFn('people.delete_user')
                }
            };
        };
    });
