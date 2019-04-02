 (function() {
     'use strict';
     angular.module('BlurAdmin.pages.CourseForm')
         .controller('CourseFormCtrl', xxx);
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

        $scope.addTopic = function(){
            $state.go("topic-form", {id: "", tab: "activities"});
            // tab = Prerequisites dan activities
        }

        $scope.addGrade = function(){ 
            $scope.open('app/pages/MasterCourse/CourseForm/gradeForm.html','lg');
        }

        $scope.topics = [
            {Id:"1", CourseTopic:"Say It With Colors!", Summary:"Simple, Compound and Complex Sentence", Objective:"Students are able to identify different types of sentences.", SortOrder:"1"},
            {Id:"2", CourseTopic:"We Will Rock You!", Summary:"Simple and Compound Sentences", Objective:"Students are able to identify different types of sentences.", SortOrder:"2"},
            {Id:"3", CourseTopic:"Face to Face", Summary:"Adjective Clause", Objective:"Students are able to identify different types of sentences.", SortOrder:"3"},
            {Id:"4", CourseTopic:"Liar Liar", Summary:"Adverbial Clauses of Place, Time, Reason and Contrast", Objective:"Students are able to identify different types of sentences.", SortOrder:"4"},
            {Id:"5", CourseTopic:"Intention, not Imitation", Summary:"Adverbial Clauses of Purpose and Result", Objective:"Students are able to identify different types of sentences.", SortOrder:"5"},     
        ]
        
        $scope.grades = [
            {Id:"1", Activity:"Assignment 1", Weight: "0.125", Grade: "Value", Minimum: "0", Maximum: "5", GradePass: "3"},
            {Id:"2", Activity:"Quiz 1", Weight: "0.125", Grade: "Value", Minimum: "0", Maximum: "5", GradePass: "3"},
            {Id:"3", Activity:"Assignment 2", Weight: "0.125", Grade: "Value", Minimum: "0", Maximum: "5", GradePass: "3"},
            {Id:"4", Activity:"Quiz 2", Weight: "0.125", Grade: "Value", Minimum: "0", Maximum: "5", GradePass: "3"},
            {Id:"5", Activity:"Assignment 3", Weight: "0.125", Grade: "Value", Minimum: "0", Maximum: "5", GradePass: "3"},
            {Id:"6", Activity:"Quiz 3", Weight: "0.125", Grade: "Value", Minimum: "0", Maximum: "5", GradePass: "3"},
            {Id:"7", Activity:"Assignment 4", Weight: "0.125", Grade: "Value", Minimum: "0", Maximum: "5", GradePass: "3"},
            {Id:"8", Activity:"Quiz 4", Weight: "0.125", Grade: "Value", Minimum: "0", Maximum: "5", GradePass: "3"},
        ]
     }
 })();