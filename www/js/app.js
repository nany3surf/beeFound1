var beef = angular.module('beefound', [
    'ngRoute',
    'ngCookies',
    'oc.lazyLoad',
    'tweetsController'
]);

beef.config(function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl:'templates/login.html',
            controller: 'homeLogin',
            reloadOnSearch: false
        })
        .when('/tweets', {
            templateUrl:'templates/tweets.html',
            controller : 'tweetsController'

        })
        .otherwise({
            redirectTo: '/finder'
        });

});