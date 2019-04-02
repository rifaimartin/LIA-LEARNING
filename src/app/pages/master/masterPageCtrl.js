(function () {
    'use strict';
    angular.module('BlurAdmin.pages.master')
    .controller('masterPageCtrl', xxx);
    /** @ngInject */

    function xxx($timeout, $scope, $log, lia) {
        $scope.data = [
        {
            id: '1',
            nama: 'Ketentuan Biaya Postponed',
            lama: 'SP_KetentuanBiaya',
            kelompok: 'Ketentuan Potpone 2017',
            status: '1',
            status_persetujuan: '0',
            disetujui_oleh: 'Admin',
            disetujui_pada: '10-Okt-2017 10:10',
            dibuat_oleh: 'Staf Mindik',
            dibuat_pada: '10-Okt-2017 10:09'
        }, {
            id: '2',
            nama: 'Ketentuan Nilai',
            lama: 'SP_KetentuanNilai',
            kelompok: 'Ketentuan Kelulusan 2017',
            status: '0',
            status_persetujuan: '1',
            disetujui_oleh: 'Admin',
            disetujui_pada: '10-Okt-2017 10:10',
            dibuat_oleh: 'Staf Mindik',
            dibuat_pada: '10-Okt-2017 10:09'
        }, {
            id: '3',
            nama: 'Ketentuan Absensi',
            lama: 'SP_KetentuanABC',
            kelompok: 'Ketentuan Kelulusan 2017',
            status: '0',
            status_persetujuan: '1',
            disetujui_oleh: 'Admin',
            disetujui_pada: '10-Okt-2017 10:10',
            dibuat_oleh: 'Staf Mindik',
            dibuat_pada: '10-Okt-2017 10:09'
        }
        ];
        // 

         //FUNGSI BARU
          $scope.showForm = function(){
            $scope.open('app/pages/master/form.html','lg');
         }
        lia.modal($scope);
         lia.behaviour($scope);
         lia.select_control($scope);
         lia.contextmenu($scope,[],$scope.privileges);
         $scope.$watch('data',function(){
         lia.init($scope,$scope.data);//nilai scope.data berdasarkan data kita
         });


         $scope.doSave = function() {
             var id = $scope.data.length + 1;
             id = id.toString();
             $scope.data1 = {
                 id: id,
                nama:$scope.form.nama,
                lama:$scope.form.lama,
                kelompok:$scope.form.kelompok,
                status: '1',
                status_persetujuan: '1',
                disetujui_oleh:'admin',
                disetujui_pada: '18-des-2017 12:53',
                dibuat_oleh: 'Staf Mindik',
                dibuat_pada: '18-des-2017 12:53',
            };
                $scope.data.push($scope.data1);
                $scope.view_object($scope.data1.id);
                $scope.showSuccessMsg();
         }
         // FUNGSI BARU END
     }
 })();