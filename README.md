angular-mixpanel
================

Wraps the mixpanel JavaScript global to make it injectable and aid in testing.

Installation
------------

Install via bower: `bower install angular-mixpanel`

Or if you're old skool, copy `src/angular-mixpanel.js` into your project.

Then add the script to your page (be sure to include the mixpanel lib as well):

```html
<script src="/bower_components/mixpanel/mixpanel.js"></script>
<script src="/bower_components/angular-mixpanel/angular-mixpanel.js"></script>
```

Usage
-----

First add the dependency to your app:

```javascript
angular.module('myApp', ['analytics.mixpanel']);
```

Minimally you'll need to configure your API key like so:

```javascript
 angular.module('analytics.mixpanel')
        .config(['$mixpanelProvider', function($mixpanelProvider) {
            $mixpanelProvider.apiKey('<your API key>');
        }]);
```

You can also supply [super properties](https://mixpanel.com/help/reference/javascript#super-properties):

```javascript
 angular.module('analytics.mixpanel')
        .config(['$mixpanelProvider', function($mixpanelProvider) {
            $mixpanelProvider.apiKey('<your API key>');

            $mixpanelProvider.superProperties({
                someProp: true,
                anotherOne: [1,2,3]
            });
        }]);
```

Then you can inject `$mixpanel` wherever needed. The API is identical to the standard mixpanel JavaScript global. For example:

```javascript
angular.module('myApp').controller('MyCtrl', function ($scope, $mixpanel) {
    $mixpanel.track('my event');
});
```

Issues or feature requests
--------------------------

Create a ticket [here](https://github.com/kuhnza/angular-mixpanel/issues)

Contributing
------------

Issue a pull request including any relavent testing and updated any documentation if required.
