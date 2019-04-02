 (function() {
     'use strict';
     angular.module('BlurAdmin.pages.ContentPages')
         .controller('ContentPagesCtrl', xxx);
     /** @ngInject */

     function xxx($timeout, $scope, $log, lia, $http, config, toastr, $state, $stateParams) {
        $scope.close = function(){
            $state.go("course-list");
        }
        $scope.id = $stateParams.id;
        $scope.mode = $scope.id != ""? "edit":"create";
        $scope.data = {};
        $scope.contentPages = [
            {title: "Understanding Simple Sentence", content: "", nextPage: ""},
            {title: "Understanding Compound Sentence", content: "", nextPage: ""},            
        ];

        $scope.addNewPage = function(){
            $scope.contentPages.push({title:"", content:"", newPage: ""});
        }


        lia.behaviour($scope);
        lia.modal($scope);
        if($scope.mode == "create"){
            $scope.behaviour_add();
        }else{
            $scope.behaviour_edit();
        }

       
     }
 })();