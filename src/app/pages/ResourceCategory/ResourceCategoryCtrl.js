(function () {
    'use strict';
    angular.module('BlurAdmin.pages.ResourceCategory')
        .controller('ResourceCategoryCtrl', xxx);
    /** @ngInject */

    function xxx($timeout, $scope, $log, lia, $http, config, ResourceCategorySvc, toastr, $filter, $loading, $uibModalStack) {
        lia.modal($scope);
        lia.behaviour($scope);
        lia.select_control($scope);
        lia.contextmenu($scope,[],$scope.privileges);
        $scope.formLesson = {}
        $scope.getParams = "Id";
        $scope.branch = []
        $scope.branchclass = []
        $scope.x = {}
        $scope.stripArray = []
        $scope.dummy = '-';
        $scope.smartState = null;
        $scope.cek = function () {
            console.log($scope.x.SelectedActivityType)
        }
        $scope.callServer = function callServer(tableState) {
            $scope.smartState = tableState;
            $scope.isLoading = true;
            $scope.data = []
            var pagination = tableState.pagination;
            if ($scope.isFilter) {
                pagination.selectPage = 1
                $scope.isFilter = false
            }
            var limit = pagination.number || 10; // Number of entries showed per page.
            var convert = limit - 1;
            var start = pagination.selectPage; // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            // $scope.data = dummy;
            ResourceCategorySvc.getlist(limit, start, tableState).then(function (res) {
                $scope.data = res.data.Data;
                $scope.page = start
                $scope.pageNum = pagination.selectPage - 1;
                $scope.pageSize = pagination.number;
                $scope.totalData = res.data.TotalData;
                console.log($scope.data);
                tableState.pagination.numberOfPages = Math.ceil(res.data.TotalData / limit); //set the number of pages so the pagination can update
                $scope.isLoading = false;
                $timeout(function () {
                    $scope.spin = false;
                }, 1000);
            });
        };
        $scope.changeFilter = function () {
            $scope.isFilter = true
        }
        $scope.refreshTable = function () {
            $scope.callServer($scope.smartState);
            $scope.spin = true;
        }

        //FUNGSI BARU
        $scope.showForm = function () { $scope.open('app/pages/ResourceCategory/Form.html', 'lg'); }

        // FUNGSI BARU END
        $scope.form = {};
        $scope.doSave = function () {
            $loading.start('save');
            console.log($scope.form, 'formsave')
            ResourceCategorySvc.create($scope.form).then(function (res) {
                $loading.finish('save');
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                } else {
                    $scope.ToEdit();
                    $scope.refreshTable();
                    toastr.success(res.data.Message);
                }
            })
        }
        $scope.doEdit = function () {
            $loading.start('save');

            ResourceCategorySvc.update($scope.form).then(function (res) {
                $loading.finish('save');
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                } else {
                    $scope.ToEdit();
                    $scope.refreshTable();
                    toastr.success(res.data.Message);
                }
            });
        }
        $scope.doDelete = function () {
            var x = 0
            for (var i = 0; i < $scope.selected.length; i++) {
                ResourceCategorySvc.delete($scope.selected[i]).then(function (res) {
                    if (res.data.ErrorCode !== 0) {
                        toastr.error(res.data.Message);
                        return
                    } else {
                        $scope.refreshTable();
                        if (x === ($scope.selected.length - 1)) {
                            toastr.success(res.data.Message);
                            $scope.selected = []
                        }
                    }
                    x++
                });
            }
        }
        $scope.ToEdit = function () {
            $timeout(function () {
                angular.element("#hideButton").triggerHandler('click');
            })

        }
        $scope.deleteInTable = function (id, state) {
            if (state == 'form') {
                $scope.form.ResourceDetails.splice(id, 1);
            } else if (state == 'lesson') {
                $scope.formLesson.LessonPages.splice(id, 1)
            }

        }
        $scope.view_object = async function (id) {
            //dummy
            $loading.start('save');

            if (id == undefined) { id = $scope.getId; }
            $loading.start('save');
            ResourceCategorySvc.getById(id).then(async function (res) {
                $loading.finish('save');
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                } else {
                    console.log(res.data.Data)
                    $scope.form = res.data.Data;




                }
            });
        }


        $scope.dismissUibModal = function () {
            var top = $uibModalStack.getTop();
            if (top) {
                $uibModalStack.dismiss(top.key);
            }
        }



        $scope.submit = function () {
            if ($scope.add) {
                $scope.doSave();
            } else if (!$scope.add) {
                $scope.doEdit();
            }
        }
    }
})();