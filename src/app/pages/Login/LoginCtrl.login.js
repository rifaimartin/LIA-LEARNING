 (function() {
   'use strict';
   angular.module('LoginModule', ['ui.router', 'ngStorage','toastr','BlurAdmin.setting'])
    .config(toastrLibConfig)
    .factory('LoginSvc', function($http, config) {
        return {
           login: function(data) {
               var url = config.apiUserManagement + 'login';
               return $http.post(url, data)
            },
        };
    })
    .controller('LoginCtrl', xxx);
    /** @ngInject */
    function toastrLibConfig(toastrConfig) {
        angular.extend(toastrConfig, {
            closeButton: true,
            closeHtml: '<button>&times;</button>',
            // timeOut: 9000000000,
            autoDismiss: false,
            containerId: 'toast-container',
            maxOpened: 0,
            newestOnTop: true,
            positionClass: 'toast-top-center',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            target: 'body'
        });
    }
   /** @ngInject */
   function xxx($timeout, $scope, $location, $localStorage, $state, config, $window, $http,toastr,LoginSvc) {
      if($localStorage.isLogin) $window.location.href = config.url + "#/dashboard";
         $scope.$storage = $localStorage;
         $scope.login = function() {
             $scope.isLoading = true;
            LoginSvc.login($scope.form).then(function (res) {
                //  console.log(res)
                if(res.data.ErrorCode !== 0){
                    $scope.isLoading = false;
                   toastr.error(res.data.Message);
               }else{
                   $localStorage.isLogin = true;
                   $localStorage.$default(res.data.Data);
                   delete $localStorage.Password;
                   delete $localStorage.Salt;
                //    console.log(res.data.Data);
                    toastr.success(res.data.Message);
                    $timeout(function(){
                        $window.location.href = config.url + "#/dashboard";
                    });
                    $scope.isLoading = false;
                }
        })
        }
    }
})();