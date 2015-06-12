/**
 * Created by danielalorenzo on 3/6/15.
 */
angular.module('loginController', ["BEEFound.services.Authentication"])
    .config(function(googleLoginProvider) {
        googleLoginProvider.configure({
            clientId: '943071059112-ml56hbmgg8uhjam96bjhq66kotbj491a.apps.googleusercontent.com',
            scopes: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/plus.login", "https://www.googleapis.com/auth/calendar"]
        });
    })
    .controller('loginController', function($scope, googleLogin, googlePlus) {

        // This flag we use to show or hide the button in our HTML.
        $scope.signedIn = false;
        $scope.message = null;
        $scope.currentUser = '';

        $scope.value = googleLogin.login();
        console.log($scope.value);
        if ($scope.value.$$state.status == 0){
            $scope.signedIn = true;
            $scope.message = null;
        }
        else{
            $scope.signedIn = false;
            $scope.message = "An error has ocurred while signing in.";
        }

        $scope.$on("googlePlus:loaded", function() {
            googlePlus.getCurrentUser().then(function(userInfo) {
                $scope.currentUser = userInfo;
            });
        });
    }
);