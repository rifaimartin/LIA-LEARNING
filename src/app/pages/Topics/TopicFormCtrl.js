 (function() {
   'use strict';
   angular.module('BlurAdmin.pages.TopicForm')
   .controller('TopicFormCtrl', xxx);
   /** @ngInject */

   function xxx($timeout, $scope, $log, lia, $http, config, toastr, $state, $stateParams) {
    $scope.close = function(){
        $state.go("course-form");
    }
    $scope.id = $stateParams.id;
    $scope.tab = $stateParams.tab;
    $scope.mode = $scope.id != ""? "edit":"create";
    $scope.data = {};
    $scope.objectiveText = "";
    $scope.objectives = ["Student able to identify simple clause", "Student able to identify complex clause", "Student able to make simple clause"];

    lia.behaviour($scope);
    if($scope.mode == "create"){
        $scope.behaviour_add();
    }else{
        $scope.behaviour_edit();
    }

    $scope.setTab = function(tab){
        $scope.tab = tab;
    }

    $scope.addActivity = function(){
        $state.go("lesson-activity", {id: "", tab: "pages"});
            //tab = pages, report, grades
        }

        $scope.deleteObjective = function(index){
            $scope.objectives.splice(index, 1);
        }

        $scope.addObjective = function(){
            $scope.objectives.push($scope.objectiveText);
            $scope.objectiveText = "";
        }

        // Angular Array
        $scope.contact = [
            { id: 1, name: "Ben", age: 28, value: "value kosong"   }, 
            { id: 2, name: "Sally", age: 24, value: "value kosong" }, 
            { id: 3, name: "John", age: 32, value: "value kosong"  }, 
            { id: 4, name: "Jane", age: 40, value: "value kosong"  },
        ]

        $scope.removeContact = function(index) {
              $scope.contact.splice(index, 1);
          };

        $scope.addContact = function() {
              $scope.inserted = {
                id: $scope.contact.length+1,
                name: null,
                age: null,
                value:null,
            };
            $scope.contact.push($scope.inserted);
        };  


        // Angular Array
        $scope.activities = [
            {Id:"1", name:"What is Simple, Compound, Complex Sentence",          type:"Lesson",     graded:"No",  SortOrder:"1"},
            {Id:"2", name:"Read the passage and Underline S, Cpd, Cpx Sentence", type:"Assignment", graded:"Yes", SortOrder:"2"},
            {Id:"3", name:"Identify Type of Sentence (S, Cpd or Cpx)",           type:"Quic",       graded:"Yes", SortOrder:"3"},
            {Id:"3", name:"Identify Type of Sentence (S, Cpd or Cpx)",           type:"Forum",      graded:"Yes", SortOrder:"4"},
            {Id:"3", name:"Identify Type of Sentence (S, Cpd or Cpx)",           type:"Choice",     graded:"Yes", SortOrder:"5"},
        ]  
}
})();

