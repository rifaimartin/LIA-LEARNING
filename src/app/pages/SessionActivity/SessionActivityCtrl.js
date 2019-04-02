(function () {
    'use strict';
    angular.module('BlurAdmin.pages.SessionActivity')
        .controller('SessionActivityCtrl', xxx);
    /** @ngInject */

    function xxx($timeout, $scope, $log, lia, $http, config, SessionActivitySvc, toastr, $filter, $loading, $uibModalStack) {
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
        $scope.activitytype = [{ Name: 'Lesson' }, { Name: 'Assignment' }, { Name: 'Quiz' }]
        $scope.session = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
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
            SessionActivitySvc.getlist(limit, start, tableState).then(function (res) {
                $scope.data = res.data.Data;
                $scope.page=start;
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
        $scope.refreshTable = function () {
            $scope.callServer($scope.smartState);
            $scope.spin = true;
        }
        $scope.changeFilter = function () {
            $scope.isFilter = true
        }
        //FUNGSI BARU
        $scope.showForm = function () { $scope.open('app/pages/SessionActivity/Form.html', 'lg'); }
        $scope.showPopupCurriculum = function () {
            $scope.open('app/pages/SessionActivity/popupCurriculum.html', 'lg');
        }

        // FUNGSI BARU END
        $scope.form = {};
        $scope.doSave = function () {
            $loading.start('save');
            $scope.form.MasterProgramId = $scope.form.selectedMasterProgram.Id
            $scope.form.Session = $scope.form.selectedSession
            console.log($scope.form, 'formsave')
            SessionActivitySvc.create($scope.form).then(function (res) {
                $loading.finish('save');
                if (res.data.ErrorCode !== 0) {
                    if (res.data.ErrorCode == 1) {
                        toastr.error("Session Activity for this class and session is already defined");
                    }
                    toastr.error(res.data.Message);
                } else {
                    $scope.ToEdit();
                    $scope.refreshTable();
                    toastr.success(res.data.Message);
                }
            });
        }
        $scope.doEdit = function () {
            $loading.start('save');

            $scope.form.MasterProgramId = $scope.form.selectedMasterProgram.Id
            $scope.form.MasterProgramName = $scope.form.selectedMasterProgram.Name
            $scope.form.MasterProgramCode = $scope.form.selectedMasterProgram.Code
            $scope.form.Session = $scope.form.selectedSession
            SessionActivitySvc.update($scope.form).then(function (res) {
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
                SessionActivitySvc.delete($scope.selected[i]).then(function (res) {
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
                $scope.form.SessionActivityDetails.splice(id, 1);
            } else if (state == 'lesson') {
                $scope.formLesson.LessonPages.splice(id, 1)
            }

        }
        $scope.view_object = function (id) {
            //dummy
            $loading.start('save');

            if (id == undefined) { id = $scope.getId; }
            $loading.start('save');
            SessionActivitySvc.getById(id).then(async function (res) {
                $loading.finish('save');
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                } else {
                    console.log(res.data.Data)
                    $scope.form = res.data.Data;
                    for (var i = 0; i < $scope.masterprogramlist.length; i++) {
                        if ($scope.form.MasterProgramId == $scope.masterprogramlist[i].Id) {
                            $scope.form.selectedMasterProgram = $scope.masterprogramlist[i]

                        }
                    }


                    for (var i = 0; i < $scope.form.SessionActivityDetails.length; i++) {

                        if ($scope.form.SessionActivityDetails[i].AssignmentName != null) {
                            $scope.form.SessionActivityDetails[i].ActivityName = $scope.form.SessionActivityDetails[i].AssignmentName
                            $scope.form.SessionActivityDetails[i].ActivityType = 'Assignment'
                        } else if ($scope.form.SessionActivityDetails[i].LessonName != null) {
                            $scope.form.SessionActivityDetails[i].ActivityName = $scope.form.SessionActivityDetails[i].LessonName
                            $scope.form.SessionActivityDetails[i].ActivityType = 'Lesson'
                        } else if ($scope.form.SessionActivityDetails[i].QuizName != null) {
                            $scope.form.SessionActivityDetails[i].ActivityName = $scope.form.SessionActivityDetails[i].QuizName
                            $scope.form.SessionActivityDetails[i].ActivityType = 'Quiz'
                        }
                    }
                    $scope.getSessionList($scope.form.selectedMasterProgram.NumberOfSessions)
                    $scope.form.selectedSession = $scope.form.Session

                }
            });
        }

        $scope.addRow = function (parameter) {
            if (parameter == 'Lesson') {
                $scope.open('app/pages/SessionActivity/popupLesson.html', 'lg');
            } else if (parameter == 'Assignment') {
                $scope.open('app/pages/SessionActivity/popupAssignment.html', 'lg');
                $scope.formAssignment = {}
            } else if (parameter == 'Quiz') {
                $scope.open('app/pages/SessionActivity/popupQuiz.html', 'lg');
                $scope.formQuiz = {};
                $scope.formQuiz.MultipleChoice = true;
                $scope.formQuiz.Questions = [];
                $scope.formQuiz.QuestionsTOF = []
                $scope.formQuiz.QuestionsSA = []
                $scope.TrueOrFalseRow = 4;
                $scope.ShortAnswerRow = 4;
                $scope.formQuiz.TrueOrFalse = false;
                $scope.formQuiz.ShortAnswer = false;
            }
        }
        $scope.dismissUibModal = function () {
            var top = $uibModalStack.getTop();
            if (top) {
                $uibModalStack.dismiss(top.key);
            }
        }
        $scope.getBranch = function () {
            $loading.start('save')
            SessionActivitySvc.getBranch().then(function (res) {
                $loading.finish('save')
                if (res.data.ErrorCode == 0) {
                    $scope.branch = res.data.Data
                } else {
                    toastr.error(res.data.Message);
                }
            })
        }
        $scope.getMasterProgramList = function () {
            $loading.start('save')
            SessionActivitySvc.getMasterProgramList().then(function (res) {
                $loading.finish('save')
                if (res.data.ErrorCode == 0) {
                    $scope.masterprogramlist = res.data.Data
                } else {
                    toastr.error(res.data.Message);
                }
            })
        }
        $scope.getSessionList = function (number) {
            $scope.sessionlist = []
            for (var i = 1; i <= number; i++) {
                $scope.sessionlist[i] = i
            }

        }
        $scope.getMasterProgramList()
        $scope.getBranch();
        $scope.getBranchClass = function (id) {
            $loading.start('save')
            SessionActivitySvc.getBranchClass(id).then(function (res) {
                $loading.finish('save')
                if (res.data.ErrorCode == 0) {
                    $scope.branchclass = res.data.Data
                    if ($scope.branchclass.length == 0) {
                        toastr.error('There is no Class in this Branch!')
                    }
                } else {
                    $scope.showError();
                }
            })
        }
        $scope.getSession = function (id) {
            $loading.start('save')
            SessionActivitySvc.getSession(id).then(function (res) {
                $loading.finish('save')
                if (res.data.ErrorCode == 0) {
                    $scope.session = res.data.Data
                    if ($scope.session.length == 0) {
                        toastr.error('There is no Session in this Class!')
                    }
                } else {
                    $scope.showError();
                }
            })
        }
        $scope.getBranchProgramCurriculum = function (masterprogramid) {
            $loading.start('save')
            SessionActivitySvc.getBranchProgramCurriculum(masterprogramid).then(function (res) {
                $loading.finish('save')
                if (res.data.ErrorCode == 0) {
                    $scope.branchprogramcurriculum = res.data.Data
                } else {
                    $scope.showError();
                }
            })
        }
        $scope.showCurriculumActivity = function (data) {
            $scope.CurriculumFromList = data
            $scope.isLoadingPopupCurriculumTable = true
            SessionActivitySvc.getActivity(data.Id).then(function (res) {
                $scope.isLoadingPopupCurriculumTable = false
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                } else {
                    console.log(res.data.Data, 'get activity')
                    $scope.CurriculumFromList.Details = res.data.Data;
                    $scope.CurriculumFromList.CheckboxStatus = []
                    for (var i = 0; i < $scope.CurriculumFromList.Details.length; i++) {
                        $scope.CurriculumFromList.CheckboxStatus[i] = false
                        if ($scope.CurriculumFromList.Details[i].AssignmentId != null) {
                            $scope.CurriculumFromList.Details[i].ActivityName = $scope.CurriculumFromList.Details[i].AssignmentName
                            $scope.CurriculumFromList.Details[i].ActivityType = 'Assignment'
                        } else if ($scope.CurriculumFromList.Details[i].LessonId != null) {
                            $scope.CurriculumFromList.Details[i].ActivityName = $scope.CurriculumFromList.Details[i].LessonName
                            $scope.CurriculumFromList.Details[i].ActivityType = 'Lesson'
                        } else if ($scope.CurriculumFromList.Details[i].QuizId != null) {
                            $scope.CurriculumFromList.Details[i].ActivityName = $scope.CurriculumFromList.Details[i].QuizName
                            $scope.CurriculumFromList.Details[i].ActivityType = 'Quiz'
                        }
                    }
                }
            })
            $scope.open('app/pages/SessionActivity/popupCurriculumActivity.html', 'lg');
        }
        $scope.AddCurriculumActivity = function () {
            console.log($scope.CurriculumFromList.CheckboxStatus, 'isi kurikulum list')
            if ($scope.form.SessionActivityDetails == undefined) {
                $scope.form.SessionActivityDetails = []
            }
            for (var i = 0; i < $scope.CurriculumFromList.CheckboxStatus.length; i++) {
                if ($scope.CurriculumFromList.CheckboxStatus[i] == true) {
                    $scope.CurriculumFromList.Details[i].ActivityId = $scope.CurriculumFromList.Details[i].Id
                    if ($scope.form.SessionActivityDetails == undefined || $scope.form.SessionActivityDetails.length == 0 ) {
                        $scope.CurriculumFromList.Details[i].Sequence = 1
                    } else {
                        var highest = Math.max.apply(Math,$scope.form.SessionActivityDetails.map(function(o){return o.Sequence;}))
                        $scope.CurriculumFromList.Details[i].Sequence = highest + 1
                    }
                    delete $scope.CurriculumFromList.Details[i].Id
                    if (!$scope.add) {
                        $scope.CurriculumFromList.Details[i].SessionActivityId = $scope.form.Id
                    }


                    $scope.form.SessionActivityDetails.push($scope.CurriculumFromList.Details[i])
                }
            }
        }

        $scope.DetailBehavior = function (isCreate, data) {
            console.log(data, 'data tabel')
            if (isCreate) {
                $scope.controlDetails = true
                $scope.addDetails = true
                $scope.editDetails = false
            } else {
                $scope.controlDetails = false
                $scope.editDetails = true
                $scope.addDetails = false

                if (data.ActivityType == 'Lesson') {
                    SessionActivitySvc.getByIdLesson(data.ActivityLessonId).then(function (res) {
                        if (res.data.ErrorCode !== 0) {
                            toastr.error(res.data.Message);
                        } else {
                            console.log(res.data.Data, 'get lesson')
                            $scope.formLesson = res.data.Data;
                            $scope.open('app/pages/SessionActivity/popupLesson.html', 'lg');
                        }
                    })

                } else if (data.ActivityType == 'Quiz') {
                    SessionActivitySvc.getByIdQuiz(data.ActivityQuizId).then(function (res) {
                        if (res.data.ErrorCode !== 0) {
                            toastr.error(res.data.Message);
                        } else {
                            console.log(res.data.Data, 'get quiz')
                            $scope.formQuiz = res.data.Data;
                            $scope.open('app/pages/SessionActivity/popupQuiz.html', 'lg');
                            $scope.formQuiz.Questions = $scope.formQuiz.QuizQuestionsMultiple
                            $scope.formQuiz.QuestionsTOF = $scope.formQuiz.QuizQuestionsTrueFalse
                            $scope.formQuiz.QuestionsSA = $scope.formQuiz.QuizQuestionsShortAnswer

                            if ($scope.formQuiz.Questions.length == 0) {
                                $scope.formQuiz.MultipleChoice = false
                            } else {
                                $scope.formQuiz.MultipleChoice = true
                            }
                            if ($scope.formQuiz.QuestionsTOF.length == 0) {
                                $scope.formQuiz.TrueOrFalse = false
                            } else {
                                $scope.formQuiz.TrueOrFalse = true
                            }
                            if ($scope.formQuiz.QuestionsSA.length == 0) {
                                $scope.formQuiz.ShortAnswer = false
                            } else {
                                $scope.formQuiz.ShortAnswer = true
                            }
                        }
                    })
                } else if (data.ActivityType == 'Assignment') {

                    SessionActivitySvc.getByIdAssignment(data.ActivityAssignmentId).then(function (res) {
                        if (res.data.ErrorCode !== 0) {
                            toastr.error(res.data.Message);
                        } else {
                            console.log(res.data.Data, 'get assignment')
                            $scope.formAssignment = res.data.Data;
                            $scope.open('app/pages/SessionActivity/popupAssignment.html', 'lg');
                        }
                    })

                }
            }
        }

        $scope.viewLessonDetail = function (data, index) {
            console.log(data)
            $scope.indexEditlessonDetail = index
            $scope.EditlessonDetail = true
            $scope.lessonDetail = data
            $scope.open('app/pages/SessionActivity/popupLessonAddPage.html', 'lg');
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