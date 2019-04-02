(function() {
  'use strict';

  angular.module('BlurAdmin.theme.components')
    .controller('baWizardCtrl', baWizardCtrl);

  /** @ngInject */
  function baWizardCtrl($scope) {
    var vm = this;
    vm.tabs = [];

    vm.tabNum = 0;
    vm.progress = 0;

    vm.addTab = function(tab) {
      tab.setPrev(vm.tabs[vm.tabs.length - 1]);
      vm.tabs.push(tab);
      vm.selectTab(0);
      $scope.$watch(angular.bind(vm, function () {return vm.tabNum;}), calcProgress);
    };

    vm.selectTab = function (tabNum) {
      vm.tabs[vm.tabNum].submit();
      if (vm.tabs[tabNum].isAvailiable()) {
        vm.tabNum = tabNum;
        vm.tabs.forEach(function (t, tIndex) {
          tIndex == vm.tabNum ? t.select(true) : t.select(false);
        });
      }
    };

    vm.isFirstTab = function () {
      return vm.tabNum == 0;
    };
    $scope.isFirstTab = function () {
      vm.selectTab(0);
    };
    $scope.wizarSetTab = function (num) {
      vm.tabNum = num;
    };
    $scope.wizardNumbs = vm.tabNum;

    vm.isLastTab = function () {
      return vm.tabNum == vm.tabs.length - 1 ;
    };

    vm.nextTab = function () {
      vm.selectTab(vm.tabNum + 1);
      $scope.cari(vm.tabNum);
    };

    vm.previousTab = function () {
      vm.selectTab(vm.tabNum - 1);
      $scope.cari(vm.tabNum);
    };

    function calcProgress() {
      vm.progress = ((vm.tabNum + 1) / vm.tabs.length) * 100;
    }
  }
})();