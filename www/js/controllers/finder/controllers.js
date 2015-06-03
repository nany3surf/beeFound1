angular.module('finderController', [])

    /* Users controller */
    .controller('FinderController', function($scope, userService) {
        $scope.users = userService.getUsers();
        $scope.proyectos = userService.getProyects();
        $scope.roles = userService.getRoles();
    })

    /* User Controller */
    /*controller('userController', function($scope, $routeParams, ergastAPIservice) {*/
    .controller('FinderUserController', function($scope, $routeParams, userService) {
        $scope.id = $routeParams.id;
        $scope.proyectos = [];
        $scope.user = userService.getUser($scope.id);

    });