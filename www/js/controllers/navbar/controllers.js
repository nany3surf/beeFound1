angular.module('navbarController', [])
    .controller('navbarController' , function($scope ,$location) {
        $scope.isActive = function (viewLocation) {
            var active = false;

            if ($location.path().indexOf(viewLocation) != -1){
                active = true;
            }
            return active;
        };
    });