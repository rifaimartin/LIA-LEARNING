 (function() {
     'use strict';
     angular.module('BlurAdmin.pages.CourseList')
         .controller('CourseListCtrl', xxx);
     /** @ngInject */

     function xxx($timeout, $scope, $log, lia, baSidebarService, $parse, toastr, $state) {
         $scope.arrayToString = function(arr) {
             var str = arr.map(function(elem) {
                 return elem.name;
             }).join(",");
             return str
         };
         $scope.form = {};
         lia.modal($scope);
         lia.behaviour($scope);
         lia.select_control($scope);
         lia.contextmenu($scope,[],$scope.privileges);
         $scope.step = false;
         $scope.programsGrouped = [{
                 name: '<strong>Semua Program</strong>',
                 msGroup: true
             },
             {
                 name: '<strong>General English</strong>',
                 msGroup: true
             },
             {
                 name: 'English for Children',
                 ticked: false
             },
             {
                 name: 'English for Teens',
                 ticked: false
             },
             {
                 name: 'English for Adult',
                 ticked: false
             },
             {
                 msGroup: false
             },
             {
                 name: '<strong>English for Specific Purposes</strong>',
                 msGroup: true
             },
             {
                 name: 'Business Conversation',
                 ticked: false
             },
             {
                 name: 'Conversation',
                 ticked: false
             },
             {
                 msGroup: false
             },
             {
                 msGroup: false
             }
         ];
         $scope.programsGroupedSelected = [];


         $scope.slotJadwalGrouped = [{
                 name: '<strong>Semua Slot Jadwal</strong>',
                 msGroup: true
             },
             {
                 name: '<strong>Senin - Rabu</strong>',
                 msGroup: true
             },
             {
                 name: '07 - 09',
                 ticked: false
             },
             {
                 name: '09 - 11',
                 ticked: false
             },
             {
                 name: '11 - 13',
                 ticked: false
             },
             {
                 name: '13 - 15',
                 ticked: false
             },
             {
                 name: '15 - 17',
                 ticked: false
             },
             {
                 name: '17 - 19',
                 ticked: false
             },
             {
                 name: '19 - 21',
                 ticked: false
             },
             {
                 msGroup: false
             },
             {
                 name: '<strong>Selasa - Kamis</strong>',
                 msGroup: true
             },
             {
                 name: '07 - 09',
                 ticked: false
             },
             {
                 name: '09 - 11',
                 ticked: false
             },
             {
                 name: '11 - 13',
                 ticked: false
             },
             {
                 name: '13 - 15',
                 ticked: false
             },
             {
                 name: '15 - 17',
                 ticked: false
             },
             {
                 name: '17 - 19',
                 ticked: false
             },
             {
                 name: '19 - 21',
                 ticked: false
             },
             {
                 msGroup: false
             },
             {
                 msGroup: false
             }
         ];
         $scope.guruGrouped = [{
                 name: '<strong>Semua Guru</strong>',
                 msGroup: true
             },
             {
                 name: 'Mr. Tonny Dwi A (TH)',
                 ticked: false
             },
             {
                 name: 'Ms. Enny Handayani (EH)',
                 ticked: false
             },
             {
                 name: 'Mr. Hari Wijaya (HW)',
                 ticked: false
             },
             {
                 name: 'Mrs. Ita Juwita (IJ)',
                 ticked: false
             },
             {
                 msGroup: false
             }
         ];
         $scope.guruGroupedSelected = [];
         $scope.ruangGrouped = [{
                 name: '<strong>Semua Ruang</strong>',
                 msGroup: true
             },
             {
                 name: '<strong>Lantai 1</strong>',
                 msGroup: true
             },
             {
                 name: 'R-101',
                 ticked: false
             }, {
                 name: 'R-102',
                 ticked: false
             }, {
                 name: 'R-103',
                 ticked: false
             }, {
                 name: 'R-104',
                 ticked: false
             }, {
                 name: 'R-105',
                 ticked: false
             }, {
                 name: 'R-106',
                 ticked: false
             }, {
                 name: 'R-107',
                 ticked: false
             },

             {
                 msGroup: false
             },
             {
                 name: '<strong>Lantai 2</strong>',
                 msGroup: true
             },
             {
                 name: 'R-201',
                 ticked: false
             }, {
                 name: 'R-202',
                 ticked: false
             }, {
                 name: 'R-203',
                 ticked: false
             }, {
                 name: 'R-204',
                 ticked: false
             }, {
                 name: 'R-205',
                 ticked: false
             }, {
                 name: 'R-206',
                 ticked: false
             }, {
                 name: 'R-207',
                 ticked: false
             },
             {
                 msGroup: false
             },
             {
                 msGroup: false
             }
         ];
         $scope.ruangGroupedSelected = [];
         baSidebarService.setMenuCollapsed(true);
         $scope.show = true;
         $scope.template = 'app/pages/MasterCourse/CourseList/detail.html';
         lia.jstree($scope);
         $scope.basicConfig = {
             "core": {
                 "animation": 300,
                 "check_callback": true,
                 // "multiple": true,
                 error: function(error) {
                     $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                 },
             },
             "types": {
                 "default": {
                     "icon": false
                 },
                 "book": {
                     "icon": "../assets/img/book.png",
                 }
             },
             "plugins": [
                 "state", "types"
             ],
             "version": 1
         };
         $scope.treeData = [];
         $scope.search = function() {
             if ($scope.programsGroupedSelected.length == 0 && $scope.guruGroupedSelected.length == 0 && $scope.ruangGroupedSelected.length == 0) {
                 toastr.error("Filter Harus Diisi Semua");
             } else {
                 $scope.treeData = [{
                         "id": "n2",
                         "parent": "#",
                         "type": "book",
                         "text": "General English",
                         "state": {
                             "disabled": true,
                             "checked_parent_open": true,
                             "selected": true
                         },
                         "a_attr": { "data-id": "n1", "style": "text-decoration:none!important", }
                     },
                     {
                         "id": "n3",
                         "parent": "n2",
                         "text": "English For Children",
                         "state": {
                             "opened": true
                         },
                         "a_attr": { "data-id": "n3", "ng-click": "doTemplate('n3')" }
                     },
                     {
                         "id": "n4",
                         "parent": "n3",
                         "text": "EC-1.18.Q1.01.0001",
                         "a_attr": { "data-id": "n4", "ng-click": "doTemplate('n4')" }
                     },
                     {
                         "id": "n5",
                         "parent": "n3",
                         "text": "EC-1.18.Q1.01.0002",
                         "a_attr": { "data-id": "n5", "ng-click": "doTemplate('n5')" }
                     },
                     {
                         "id": "n6",
                         "parent": "n3",
                         "text": "EC-1.18.Q1.01.0003",
                         "a_attr": { "data-id": "n6", "ng-click": "doTemplate('n6')" }
                     },
                     {
                         "id": "n7",
                         "parent": "n3",
                         "text": "EC-1.18.Q1.01.0004",
                         "a_attr": { "data-id": "n7", "ng-click": "doTemplate('n7')" }
                     },
                     {
                         "id": "n8",
                         "parent": "n2",
                         "text": "English For Teens",
                         "state": {
                             "opened": true
                         },
                         "a_attr": { "data-id": "n8", "ng-click": "doTemplate('n8')" }
                     },
                     {
                         "id": "n9",
                         "parent": "n8",
                         "text": "INT-1.18.Q1.01.0001",
                         "a_attr": { "data-id": "n9", "ng-click": "doTemplate('n9')" }
                     },
                     {
                         "id": "n10",
                         "parent": "n8",
                         "text": "INT-1.18.Q1.01.0002",
                         "a_attr": { "data-id": "n10", "ng-click": "doTemplate('n10')" }
                     },
                     {
                         "id": "n11",
                         "parent": "n8",
                         "text": "INT-1.18.Q1.01.0003",
                         "a_attr": { "data-id": "n11", "ng-click": "doTemplate('n11')" }
                     },
                     {
                         "id": "n12",
                         "parent": "n8",
                         "text": "INT-1.18.Q1.01.0004",
                         "a_attr": { "data-id": "n12", "ng-click": "doTemplate('n12')" }
                     },
                     {
                         "id": "n13",
                         "parent": "n2",
                         "text": "English For Adult",
                         "state": {
                             "opened": true
                         },
                         "a_attr": { "data-id": "n13", "ng-click": "doTemplate('n13')" }
                     },
                     {
                         "id": "n14",
                         "parent": "n13",
                         "text": "HI-1.18.Q1.01.0001",
                         "a_attr": { "data-id": "n14", "ng-click": "doTemplate('n14')" }
                     },
                     {
                         "id": "n15",
                         "parent": "n13",
                         "text": "HI-1.18.Q1.01.0002",
                         "a_attr": { "data-id": "n15", "ng-click": "doTemplate('n15')" }
                     },
                     {
                         "id": "n16",
                         "parent": "n13",
                         "text": "HI-1.18.Q1.01.0003",
                         "a_attr": { "data-id": "n16", "ng-click": "doTemplate('n16')" }
                     },
                     {
                         "id": "n17",
                         "parent": "n13",
                         "text": "HI-1.18.Q1.01.0004",
                         "a_attr": { "data-id": "n17", "ng-click": "doTemplate('n17')" }
                     }

                 ];
                 console.log($scope.treeData);
                 $scope.basicConfig.version++;
             }
         };
         $scope.selectCustom = function(collection, attr2, attr = 'id') {
             if (!$scope.selectedByAttr.hasOwnProperty(attr2)) {
                 $scope.selectedByAttr[attr2] = [];
             }
             if ($scope.selectedByAttr[attr2].length === 0) {
                 angular.forEach(collection, function(val) {
                     $scope.selectedByAttr[attr2].push(val[attr]);
                 });
             } else if ($scope.selectedByAttr[attr2].length > 0 && $scope.selectedByAttr[attr2].length != collection.length) {
                 angular.forEach(collection, function(val) {
                     var found = $scope.selectedByAttr[attr2].indexOf(val[attr]);
                     if (found == -1) $scope.selectedByAttr[attr2].push(val[attr]);
                 });
             } else {
                 $scope.selectedByAttr[attr2] = [];
             }
             console.log($scope.selectedByAttr);
         };
         $scope.doTemplate = function(id) {
             var index = $scope.treeData.findIndex(x => x.id === id);
             $scope.programSelected = $scope.treeData[index].text;
             $scope.step = true;
         };
         
         
         $scope.showForm = function(data){
             
            $scope.form = data;
            console.log($scope.form, data)
             
            $scope.open('app/pages/MasterCourse/CourseList/form.html','lg');
        }
         $scope.$watch('data', function() {
             lia.init($scope, $scope.data); //nilai scope.data berdasarkan data kita
         });
         $scope.view_object = function (data) {
            $scope.form = data;
            console.log($scope.form, data)
        }
        $scope.addCourse = function(){
            $state.go("course-form", {tab:"topic"});
        }

        $scope.data = [{
             'Id': '1',
             'CourseName': 'EC-1 Course 2015',
             'Curricullum': 'Kurikulum EC-2015',
             'IsActive': 'Aktif',
             'Students': 'Privat',
             'StatusPersetujuan': '',
            'DisetujuiOleh': '',
            'DisetujuiPada': '',
            'DibuatOleh': '',
            'DibuatPada': '',
         },
         {
            'Id': '2',
            'CourseName': 'EC-2 Course 2015',
            'Curricullum': 'Kurikulum EC-2015',
            'IsActive': 'Aktif',
            'Students': 'Privat',
            'StatusPersetujuan': '',
            'DisetujuiOleh': '',
            'DisetujuiPada': '',
            'DibuatOleh': '',
            'DibuatPada': '',
        },
        {
            'Id': '3',
            'CourseName': 'EC-3 Course 2015',
            'Curricullum': 'Kurikulum EC-2015',
            'IsActive': 'Aktif',
            'Students': 'Privat',
            'StatusPersetujuan': '',
            'DisetujuiOleh': '',
            'DisetujuiPada': '',
            'DibuatOleh': '',
            'DibuatPada': '',
        },
        {
            'Id': '4',
            'CourseName': 'EC-4 Course 2015',
            'Curricullum': 'Kurikulum EC-2015',
            'IsActive': 'Aktif',
            'Students': 'Privat',
            'StatusPersetujuan': '',
            'DisetujuiOleh': '',
            'DisetujuiPada': '',
            'DibuatOleh': '',
            'DibuatPada': '',
        },
        {
            'Id': '5',
            'CourseName': 'EC-5 Course 2015',
            'Curricullum': 'Kurikulum EC-2015',
            'IsActive': 'Aktif',
            'Students': 'Privat',
            'StatusPersetujuan': '',
            'DisetujuiOleh': '',
            'DisetujuiPada': '',
            'DibuatOleh': '',
            'DibuatPada': '',
        },
         
         
         
        ];
     }
 })();