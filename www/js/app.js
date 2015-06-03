var beef = angular.module('beefound', [
    'ngRoute',
    'ngCookies',
    'oc.lazyLoad',
    'tweetsController',
    'finderController'
]);


beef.config(function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl:'templates/finder/users.html',
            controller: 'FinderController',
            reloadOnSearch: false
        })
        .when('/twitter', {
            templateUrl:'templates/twitter/tweets.html',
            controller : 'tweetsController'

        })
        .otherwise({
            redirectTo: '/finder'
        });

});