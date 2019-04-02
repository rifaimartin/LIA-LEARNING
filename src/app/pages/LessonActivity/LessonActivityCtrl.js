 (function() {
     'use strict';
     angular.module('BlurAdmin.pages.LessonActivity')
         .controller('LessonActivityCtrl', xxx);
     /** @ngInject */

     function xxx($timeout, $scope, $log, lia, $http, config, toastr, $state, $stateParams) {
        $scope.close = function(){
            $state.go("course-list");
        }
        $scope.id = $stateParams.id;
        $scope.tab = $stateParams.tab;
        $scope.mode = $scope.id != ""? "edit":"create";
        $scope.data = {};


        lia.behaviour($scope);
        lia.modal($scope);
        if($scope.mode == "create"){
            $scope.behaviour_add();
        }else{
            $scope.behaviour_edit();
        }

        $scope.setTab = function(tab){
            $scope.tab = tab;
        }

        $scope.addPage = function(){
            $state.go("content-pages", {id: ""});
        }

        $scope.addGrade = function(){ 
            $scope.open('app/pages/MasterCourse/CourseForm/gradeForm.html','lg');
        }

        $scope.pages = [
            {Id:"1", pageTitle:"Understanding Simple Sentence", pageType:"Content Page", jump:"Next Page", jumpPage:"Understanding Compound Sentence"},
            {Id:"2", pageTitle:"Understanding Compound Sentence", pageType:"Content Page", jump:"Next Page", jumpPage:"Understanding Complex Sentence"},
            {Id:"3", pageTitle:"Understanding Complex Sentence", pageType:"Content Page", jump:"Next Page", jumpPage:"Question Group 1"},
            {Id:"4", pageTitle:"Question Group 1", pageType:"Start Question Group", jump:"Next Page", jumpPage:"Identify Sentence Type No. 1"},
            {Id:"5", pageTitle:"Identify Sentence Type No. 1", pageType:"Content Page", jump:"Next Page", jumpPage:"Identify Sentence Type No. 2"},
            {Id:"6", pageTitle:"Identify Sentence Type No. 2", pageType:"Content Page", jump:"Next Page", jumpPage:"Identify Sentence Type No. 3"},
            {Id:"6", pageTitle:"Identify Sentence Type No. 3", pageType:"Content Page", jump:"Next Page", jumpPage:"End of Question Group 1"},
            {Id:"6", pageTitle:"End of Question Group 1", pageType:"Content Page", jump:"Next Page", jumpPage:""},
        ]
     }
 })();