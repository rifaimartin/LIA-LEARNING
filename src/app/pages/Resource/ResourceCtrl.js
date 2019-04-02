(function () {
    'use strict';
    angular.module('BlurAdmin.pages.Resource')
        .controller('ResourceCtrl', xxx);
    /** @ngInject */

    function xxx($timeout, $scope, $log, lia, $http, config, ResourceSvc, toastr, $filter, $loading, $uibModalStack, $localStorage) {
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
            ResourceSvc.getlist(limit, start, tableState).then(function (res) {
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
        $scope.showForm = function () { $scope.open('app/pages/Resource/Form.html', 'lg');$scope.disableFileInput = false }
        $scope.showPopupCurriculum = function () {
            $scope.open('app/pages/Resource/popupCurriculum.html', 'lg');
        }

        // FUNGSI BARU END
        $scope.form = {};
        $scope.doSave = function () {
            $loading.start('save');
            $scope.form.ResourceCategoryId = $scope.form.selectedResourceCategory.Id

            var formData = new FormData();
            console.log($scope.form.myFile)
            console.log( angular.toJson($scope.form))
            $scope.form.Tags = [];
            $scope.form.Creatore = [];
            $scope.form.CreatoreEmail = $localStorage.Email;
            $scope.form.CreatorFullName = $localStorage.FullName;
            formData.append("model", angular.toJson($scope.form));
            formData.append("file", $scope.form.myFile);  
            
            $http({ 
                method: 'POST',
                url: "https://lia-el-crs.azurewebsites.net/api/Resource",
                headers: { 'Content-Type': undefined },
                data: formData 
            }).then(async (res) => {
                if (res.data.ErrorCode == 0) {
                    $loading.finish('save');
                    toastr.success(res.data.Message)
                    $scope.ToEdit()
                    $scope.refreshTable()
                } else {
                    $loading.finish('save');
                    if (res.data.ErrorCode == 1) {
                        for (var i = 0; i < res.data.ValidationErrors.length; i++) {
                            toastr.error(res.data.ValidationErrors[i].ErrorMessage);
                        }
                    } else {
                        toastr.error(res.data.Message);
                    }
                }
            }).catch((res) => {
                $loading.finish('save');
                toastr.error(res.data.Message)

            })


            
        }
        $scope.doEdit = function () {
            $loading.start('save');

            $scope.form.MasterProgramId = $scope.form.selectedMasterProgram.Id
            $scope.form.Session = $scope.form.selectedSession
            ResourceSvc.update($scope.form).then(function (res) {
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
                ResourceSvc.delete($scope.selected[i]).then(function (res) {
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
            ResourceSvc.getById(id).then(async function (res) {
                $loading.finish('save');
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                } else {
                    console.log(res.data.Data)                    
                    $scope.form = res.data.Data;
                    if($scope.form.FileUrl !== null || $scope.form.FileUrl !== undefined){
                        $scope.disableFileInput = true;
                    }
                    if ($scope.resourcecategory == undefined || $scope.resourcecategory.length == 0) {
                        await $scope.getResourceCategory()
                    }
                    for (var i = 0; i < $scope.resourcecategory.length; i++) {
                        if ($scope.form.ResourceCategoryId == $scope.resourcecategory[i].Id) {
                            $scope.form.selectedResourceCategory = $scope.resourcecategory[i]

                        }
                    }




                }
            });
        }


        $scope.dismissUibModal = function () {
            var top = $uibModalStack.getTop();
            if (top) {
                $uibModalStack.dismiss(top.key);
            }
        }

        $scope.getResourceCategory = function () {
            $loading.start('save')
            return ResourceSvc.getResourceCategory().then(function (res) {
                $loading.finish('save')
                if (res.data.ErrorCode == 0) {
                    $scope.resourcecategory = res.data.Data
                } else {
                    toastr.error(res.data.Message);
                }
            })
        }
        $scope.getResourceTag = function () {
            $loading.start('save')
            return ResourceSvc.getResourceTag().then(function (res) {
                $loading.finish('save')
                if (res.data.ErrorCode == 0) {
                    $scope.resourcetag = res.data.Data
                } else {
                    toastr.error(res.data.Message);
                }
            })
        }
        $scope.getResourceCategory();
        $scope.getResourceTag();


        $scope.submit = function () {
            if ($scope.add) {
                $scope.doSave();
            } else if (!$scope.add) {
                $scope.doEdit();
            }
        }
            // $scope.files = []
            // $scope.$on("fileSelected", function (event, args) {
            //     $scope.$apply(function () {            
            //         //add the file object to the scope's files collection
                    
            //         $scope.files = args.file[0]  
            //         console.log($scope.files,'this')
                    
            //     });
            // });
            $scope.downloadLocation = function (location){
                window.location = 'https://liaelcrs935f.file.core.windows.net/lia-el-crs935f/site/assets/ResourceFile/' + location + '?sv=2017-11-09&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-10-26T07:10:25Z&st=2018-11-25T23:10:25Z&spr=https,http&sig=rnFagF7rSMfdAFLeNIihN1RbpZbOaV2%2B4j%2FGu5QO0xo%3D'
            }
    }
})();