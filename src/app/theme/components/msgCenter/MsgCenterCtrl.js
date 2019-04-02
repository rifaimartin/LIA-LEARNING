/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .controller('MsgCenterCtrl', MsgCenterCtrl);

  /** @ngInject */
  function MsgCenterCtrl($scope, $sce) {
    $scope.users = {
      0: {
        name: 'Vlad',
      },
      1: {
        name: 'Kostya',
      },
      2: {
        name: 'Andrey',
      },
      3: {
        name: 'Nasta',
      }
    };

    $scope.notifications = [
      {
        image: 'assets/img/information.svg',
        template: 'Anda belum mengikuti Ujian Written Test dan Oral yang seharusnya dilaksanakan tanggal 20 April 2018. Silakan Klik untuk mengajukan permohonan makeup test.',
        time: '5 hrs ago'
      },
      {
        image: 'assets/img/information.svg',
        template: 'Anda belum melakukan pembayaran Cicilan IV.',
        time: '5 hrs ago'
      }
    ];

    $scope.messages = [
      {
        userId: 1,
        text: 'Want to request new icons? Here\'s how. Need vectors or want to use on the...',
        time: '10 hrs ago'
      },
      {
        userId: 2,
        text: 'Explore your passions and discover new ones by getting involved. Stretch your...',
        time: '1 day ago'
      }
    ];

    $scope.getMessage = function(msg) {
      var text = msg.template;
      if (msg.userId || msg.userId === 0) {
        text = text.replace('&name', '<strong>' + $scope.users[msg.userId].name + '</strong>');
      }
      return $sce.trustAsHtml(text);
    };
  }
})();