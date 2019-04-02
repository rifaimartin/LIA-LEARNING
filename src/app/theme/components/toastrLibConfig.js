/**
 * @author v.lugovksy
 * created on 15.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .config(toastrLibConfig);

  /** @ngInject */
  function toastrLibConfig(toastrConfig) {
    angular.extend(toastrConfig, {
      "autoDismiss": false,
      "positionClass": "toast-top-center",
      "timeOut": "1000",
      "allowHtml": false,
      "closeButton": true,
      "tapToDismiss": false,
      "newestOnTop": true,
      "maxOpened": 0,
      "preventDuplicates": false,
      "preventOpenDuplicates": false
    });
  }
})();