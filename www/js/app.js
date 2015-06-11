var beef = angular.module('beefound', [
    'ngRoute',
    'BEEFound.services.Users',
    'BEEFound.services.Authentication',
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
        .when('/login/', {
            templateUrl:'templates/login/login.html',
            controller : 'loginController'
        })
        .otherwise({
            redirectTo: '/finder'
        });

});

beef.run(['$rootScope', '$location', 'authService',
        function ($rootScope, $location, authService) {

            //Client-side security. Server-side framework MUST add it's
            //own security as well since client-based security is easily hacked
            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                if (next && next.$$route && next.$$route.secure) {
                    if (!authService.user.isAuthenticated) {
                        $rootScope.$evalAsync(function () {
                            authService.redirectToLogin();
                        });
                    }
                }
            });

    }]);