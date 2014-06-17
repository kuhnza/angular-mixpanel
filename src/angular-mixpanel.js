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
         * Init the mixpanel global. Contents is a straight copy/paste of mixpanel lib
         * however the API key is supplied via the provider closure: apiKey.
         */
        function init() {
            (function (f, b) {
                if (!b.__SV) {
                    var a, e, i, g;
                    window.mixpanel = b;
                    b._i = [];
                    b.init = function (a, e, d) {
                        function f(b, h) {
                            var a = h.split(".");
                            2 == a.length && (b = b[a[0]], h = a[1]);
                            b[h] = function () {
                                b.push([h].concat(Array.prototype.slice.call(arguments, 0)))
                            }
                        }

                        var c = b;
                        "undefined" !== typeof d ? c = b[d] = [] : d = "mixpanel";
                        c.people = c.people || [];
                        c.toString = function (b) {
                            var a = "mixpanel";
                            "mixpanel" !== d && (a += "." + d);
                            b || (a += " (stub)");
                            return a
                        };
                        c.people.toString = function () {
                            return c.toString(1) + ".people (stub)"
                        };
                        i = "disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.track_charge people.clear_charges people.delete_user".split(" ");
                        for (g = 0; g < i.length; g++)f(c, i[g]);
                        b._i.push([a, e, d])
                    };
                    b.__SV = 1.2;
                    a = f.createElement("script");
                    a.type = "text/javascript";
                    a.async = !0;
                    a.src = "//cdn.mxpnl.com/libs/mixpanel-2.2.min.js";
                    e = f.getElementsByTagName("script")[0];
                    e.parentNode.insertBefore(a, e)
                }
            })(document, window.mixpanel || []);
            mixpanel.init(apiKey);

            if (superProperties) mixpanel.register(superProperties);
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
            return mixpanel;
        };
    });
