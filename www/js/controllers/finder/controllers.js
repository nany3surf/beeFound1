angular.module('finderController', [])
    .controller('FinderController', function($scope, userService) {
        $scope.users = userService.getUsers();
        $scope.proyectos = userService.getProyects();
        $scope.roles = userService.getRoles();
    })
    .controller('FinderUserController', function($scope, $routeParams, userService) {
        $scope.id = $routeParams.id;
        $scope.proyectos = [];
        $scope.user = userService.getUser($scope.id);

    });