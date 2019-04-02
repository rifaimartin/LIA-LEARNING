/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard', [])
    .config(routeConfig)
    .controller('dashboardCtrl', dashboardCtrl)
    .factory('dashboardSvc',function($http, config){
      return{
        getAllActivities: function(){
          var url = config.apiElearning + 'dashboard?mode=activity&type=1';
          return $http.get(url);
        },
        getLessonActivities : function(){
          var url = config.apiElearning + 'dashboard?mode=activity&type=2';
          return $http.get(url);
        },
        getAssignmentActivities : function(){
          var url = config.apiElearning + 'dashboard?mode=activity&type=3';
          return $http.get(url);
        },
        getQuizActivities : function(){
          var url = config.apiElearning+ 'dashboard?mode=activity&type=4';
          return $http.get(url);
        },
        getBarChart : function(){
          var url = config.apiElearning+ 'dashboard?mode=resource-repository-graph';
          return $http.get(url);
        }
      };
    })
  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('Dashboard', {
        url: '/dashboard',
        templateUrl: 'app/pages/dashboard/dashboard.html',
        title: 'Dashboard',
        controller: 'dashboardCtrl',
        // sidebarMeta: {
        //   icon: 'ion-android-home',
        //   order: 0,
        // },
      });
  }
  function dashboardCtrl(lia,dashboardSvc,$scope,baConfig, baUtil,$timeout, $element, layoutPaths) {
   
   
      
    var pieColor = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);
    $scope.charts = [];
    $scope.grafik = [];


    var getAllActivities=async()=>{
      return dashboardSvc.getAllActivities().then(async function (result) {
        if(result.data.hasOwnProperty('ErrorCode'))
        {
          $scope.AllActivities = 0;
        } else{
          $scope.AllActivities = result.data;
        }
     
         await $scope.charts.push({
          color: pieColor,
          description: 'All Activities',
          stats: $scope.AllActivities,
          bgcolor: '#337ab7',
          percent: $scope.AllActivities/ $scope.AllActivities * 100,
        })
        $('.chart').each(function () {
      var chart = $(this);
      chart.easyPieChart({
        easing: 'easeOutBounce',
        onStep: function (from, to, percent) {
          $(this.el).find('.percent').text(Math.round(percent));
        },
        barColor: '#fff',
        trackColor: 'rgba(0,0,0,0)',
        size: 84,
        scaleLength: 0,
        animation: 2000,
        lineWidth: 9,
        lineCap: 'round',
      });
    });
    })
  }
    var getLessonActivities=async()=>{
      return dashboardSvc.getLessonActivities().then(async function (result) {
          if(result.data.hasOwnProperty('ErrorCode'))
          {
            $scope.LessonActivities = 0;
          } else{
            $scope.LessonActivities = result.data;
          }
      
          await $scope.charts.push({
            color: pieColor,
            description: 'Lesson Activities',
            stats: $scope.LessonActivities,
            bgcolor: '#4cd137',
            percent: $scope.LessonActivities / $scope.AllActivities * 100,
          })
          $('.chart').each(function () {
        var chart = $(this);
        chart.easyPieChart({
          easing: 'easeOutBounce',
          onStep: function (from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
          },
          barColor: '#fff',
          trackColor: 'rgba(0,0,0,0)',
          size: 84,
          scaleLength: 0,
          animation: 2000,
          lineWidth: 9,
          lineCap: 'round',
        });
      });
      })
    }
    var getAssignmentActivities=async()=>{
      return dashboardSvc.getAssignmentActivities().then(async function (result) {
        if(result.data.hasOwnProperty('ErrorCode'))
          {
            $scope.AssignmentActivities = 0;
          } else{
            $scope.AssignmentActivities = result.data;
          }
     
       await $scope.charts.push({
          color: pieColor,
          description: 'Assignment Activities',
          stats: $scope.AssignmentActivities,
          bgcolor: '#ff3838',
          percent: $scope.AssignmentActivities / $scope.AllActivities * 100,
        })
       $('.chart').each(function () {
        var chart = $(this);
        chart.easyPieChart({
          easing: 'easeOutBounce',
          onStep: function (from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
          },
          barColor: '#fff',
          trackColor: 'rgba(0,0,0,0)',
          size: 84,
          scaleLength: 0,
          animation: 2000,
          lineWidth: 9,
          lineCap: 'round',
        });
      });
      })
    }
    var getQuizActivities=async()=>{
      return dashboardSvc.getQuizActivities().then(async function (result) {
        if(result.data.hasOwnProperty('ErrorCode'))
        {
          $scope.QuizActivities = 0;
        } else{
          $scope.QuizActivities = result.data;
        }
       
         
        await $scope.charts.push({
          color: pieColor,
          description: 'Quiz Activities',
          stats: $scope.QuizActivities,
          bgcolor: '#ff9f1a',
          percent: $scope.QuizActivities / $scope.AllActivities * 100,
        })
        $('.chart').each(function () {
        var chart = $(this);
        chart.easyPieChart({
          easing: 'easeOutBounce',
          onStep: function (from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
          },
          barColor: '#fff',
          trackColor: 'rgba(0,0,0,0)',
          size: 84,
          scaleLength: 0,
          animation: 2000,
          lineWidth: 9,
          lineCap: 'round',
        });
      });
      })
    }
    
    var run=async()=>{
      $scope.isLoading = true;
      await getAllActivities();
      await getLessonActivities();
      await getAssignmentActivities();
      await getQuizActivities();
      $scope.isLoading = false;
    }
      run();
   
      
   
  var getBarChart=async ()=>{
    $scope.isLoading = true;
    return dashboardSvc.getBarChart().then(function (result) {
      if(result.data.hasOwnProperty('ErrorCode')){
        $scope.getBarChart = [];
      }else{
     $scope.getBarChart= result.data;
     var layoutColors = baConfig.colors;
     var id = $element[0].getAttribute('id');
     var barChart = AmCharts.makeChart(id, {
     type: 'serial',
     theme: 'blur',
     color: layoutColors.defaultText,
     dataProvider: $scope.getBarChart,
     valueAxes: [
       {
         axisAlpha: 0,
         position: 'left',
         title: 'Resource Repository',
         gridAlpha: 0.5,
         gridColor: layoutColors.border,
       }
     ],
     startDuration: 1,
     graphs: [
       {
         balloonText: '<b>[[X]]: [[Y]]</b>',
         fillColorsField: 'color',
         fillAlphas: 0.7,
         lineAlpha: 0.2,
         type: 'column',
         valueField: 'Y'
       }
     ],
     chartCursor: {
       categoryBalloonEnabled: false,
       cursorAlpha: 0,
       zoomable: false
     },
     categoryField: 'X',
     categoryAxis: {
       gridPosition: 'start',
       labelRotation: 45,
       gridAlpha: 0.5,
       gridColor: layoutColors.border,
     },
     export: {
       enabled: true
     },
     creditsPosition: 'top-right',
     pathToImages: layoutPaths.images.amChart
   });
  }
     $scope.isLoading = false;
     
    })
  }
  

 
  
   

   var datachart=async()=>{
    await getBarChart();
    
  }
    datachart();


    
  }
})();