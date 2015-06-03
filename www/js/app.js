var beef = angular.module('beefound', [
    'ngRoute',
    'BEEFound.services.Users',
    'tweetsController',
    'finderController'
]);


beef.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl:'templates/finder/users.html',
            controller: 'FinderController',
            reloadOnSearch: false
        })
        .when('/finder', {
            templateUrl:'templates/finder/users.html',
            controller: 'FinderController',
            reloadOnSearch: false
        })
        .when('/finder/user/:id', {
            templateUrl:'templates/finder/user.html',
            controller: 'FinderUserController',
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