/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      
      .controller('DashboardLineChartCtrl', DashboardLineChartCtrl)
      .factory('LineChartSvc',function($http, config){
        return{
          getLineChart : function(){
            var url = config.apiElearning + 'dashboard?mode=forum-post-graph';
            return $http.get(url);
          }
        };
      })

  /** @ngInject */
  
  /** @ngInject */
    function DashboardLineChartCtrl($scope, baConfig, $element, layoutPaths, LineChartSvc) {
      var getLineChart=async ()=>{
        $scope.isLoading = true;
    return LineChartSvc.getLineChart().then(function (result) {
      if(result.data.hasOwnProperty('ErrorCode')){
        $scope.getLineChart = [];
      }else{
        $scope.getLineChart = result.data;
        console.log(result.data)
      var layoutColors = baConfig.colors;
      var id = $element[0].getAttribute('id');
      var lineChart = AmCharts.makeChart(id, {
        type: 'serial',
        theme: 'blur',
        color: layoutColors.defaultText,
        marginTop: 0,
        marginRight: 15,
        dataProvider: $scope.getLineChart,
        valueAxes: [
          {
            axisAlpha: 0,
            position: 'left',
            title: 'Forum Post',
            gridAlpha: 0.5,
            gridColor: layoutColors.border,
          }
        ],
        graphs: [
          {
            id: 'gl',
            balloonText: '[[Y]]',
            bullet: 'round',
            bulletSize: 8,
            lineColor: layoutColors.danger,
            lineThickness: 1,
            negativeLineColor: layoutColors.warning,
            type: 'smoothedLine',
            valueField: 'Y'
          }
        ],
        chartScrollbar: {
          graph: 'g1',
          gridAlpha: 0,
          color: layoutColors.defaultText,
          scrollbarHeight: 55,
          backgroundAlpha: 0,
          selectedBackgroundAlpha: 0.05,
          selectedBackgroundColor: layoutColors.defaultText,
          graphFillAlpha: 0,
          autoGridCount: true,
          selectedGraphFillAlpha: 0,
          graphLineAlpha: 0.2,
          selectedGraphLineColor: layoutColors.defaultText,
          selectedGraphLineAlpha: 1
        },
        chartCursor: {
        //   categoryBalloonDateFormat: 'MMM',
          cursorAlpha: 0,
          valueLineEnabled: true,
          valueLineBalloonEnabled: true,
          valueLineAlpha: 0.5,
          fullWidth: true
        },
        dataDateFormat: 'MMM',
        categoryField: 'X',
        categoryAxis: {
          minPeriod: 'MMM',
          minorGridAlpha: 0.1,
          minorGridEnabled: true,
          gridAlpha: 0.5,
          gridColor: layoutColors.border,
        },
        export: {
          enabled: true
        },
        creditsPosition: 'bottom-right',
        pathToImages: layoutPaths.images.amChart
      });
  
      lineChart.addListener('rendered', zoomChart);
      if (lineChart.zoomChart) {
        lineChart.zoomChart();
      }
  
      function zoomChart() {
        lineChart.zoomToIndexes(Math.round(lineChart.dataProvider.length * 0.4), Math.round(lineChart.dataProvider.length * 0.55));
      }
    }
    $scope.isLoading = false;
     
    })
  }

    getLineChart();


}

    
  
})();