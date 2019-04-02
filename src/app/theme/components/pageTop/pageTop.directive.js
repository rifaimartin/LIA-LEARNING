/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
    .directive('pageTop', pageTop)
    .directive('listMenu', listMenu)
    .controller('pageTopCtrl', pageTopCtrl);

  function pageTopCtrl($timeout, $scope, $window, $uibModal, config) {
    if (config.serverModes == 'dev') {
      $scope.dev = true
    } else {
      $scope.dev = false
    }


  }

  /** @ngInject */
  function pageTop() {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/pageTop/pageTop.html',
      controller: 'pageTopCtrl',
    };
  }
  function listMenu() {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/pageTop/listMenu.html'
    };
  }

})();