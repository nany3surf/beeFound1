var beef = angular.module('beefound', [
    'ngRoute',
    'ngCookies',
    'oc.lazyLoad'
]);


beef.config(function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl:'templates/login.html',
            controller: 'homeLogin',
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