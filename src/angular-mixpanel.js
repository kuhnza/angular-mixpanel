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
        var apiKey, superProperties, _mixpanel;

        /**
         * Init the mixpanel global
         */
        function init() {
            if (!Object.prototype.hasOwnProperty.call(window, 'mixpanel')) {
                throw 'Global `mixpanel` not available. Did you forget to include the library on the page?';
            }

            mixpanel.init(apiKey);

            waitTillAsyncApiLoaded(function () {
                if (superProperties) _mixpanel.register(superProperties);
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
                setTimeout(function () { waitTillAsyncApiLoaded(callback); }, 500);
            }

            _mixpanel = window.mixpanel;
            callback();
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
            return _mixpanel;
        };
    });
