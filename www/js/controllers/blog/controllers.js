angular.module('blogController', [])
    .controller('blogController' , function($scope , $http , $location) {
        $http.get('templates/blog/data.json')
            .success(function(data) {
                $scope.blogs = data

            });

        $scope.go = function(slug) {
            $location.path('/blog/' + slug);
        };

        $scope.slugify = function(input) {
            $scope.mySlug = Slug.slugify(input);
        };

    })
    .controller('blogContentController', function($scope, $routeParams , $http , Slug) {
            $scope.blogSlug = $routeParams.slug;
            $scope.blog = [];

            $http.get('templates/blog/data.json')
                .success(function(data) {
                    angular.forEach(data , function(value , key) {
                        if (Slug.slugify(value['slug']) == $scope.blogSlug) {
                            $scope.blog = value
                        }
                    });
                });

    });