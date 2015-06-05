angular.module('blogController', [])
    .controller('blogController' , function($scope , $http , $location) {
        $http.get('templates/blog/data.json')
            .success(function(data) {
                $scope.blogs = data

            });

        $scope.go = function(slug) {
            $location.path('/blog/' + slug);
        }

    })
    .controller('blogContentController', function($scope, $routeParams , $http) {
            $scope.blogSlug = $routeParams.slug;
            $scope.blog = [];

            $http.get('templates/blog/data.json')
                .success(function(data) {
                    angular.forEach(data , function(value , key) {
                        if (value['slug'] == $scope.blogSlug) {
                            $scope.blog = value
                        }
                    });
                });

    });