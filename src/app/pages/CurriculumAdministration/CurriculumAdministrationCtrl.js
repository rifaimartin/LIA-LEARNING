(function () {
    'use strict';
    angular.module('BlurAdmin.pages.CurriculumAdministration')
        .controller('CurriculumAdministrationCtrl', xxx);
    /** @ngInject */

    function xxx($timeout, $scope, $log, lia, $http, config, CurriculumAdministrationSvc, toastr, $filter, $loading, $uibModalStack, $rootScope) {
        lia.modal($scope);
        lia.behaviour($scope);
        lia.select_control($scope);
        lia.contextmenu($scope,[],$scope.privileges);
        $scope.isTeacher = $rootScope.isTeacher
        $scope.formLesson = {}
        $scope.getParams = "Id";
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
            // $scope.isLoading = true;
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
            $scope.isLoading = true
            CurriculumAdministrationSvc.getlist(limit, start, tableState).then(function (res) {
                $scope.page=start;
                $scope.data = res.data.Data;
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
        $scope.DetailBehavior = function (isCreate, data) {
            if (isCreate) {
                $scope.controlDetails = true
                $scope.addDetails = true
                $scope.editDetails = false
            } else {
                $scope.controlDetails = false
                $scope.editDetails = true
                $scope.addDetails = false

                if (data.ActivityType == 'Lesson') {
                    CurriculumAdministrationSvc.getByIdLesson(data.LessonId).then(function (res) {
                        if (res.data.ErrorCode !== 0) {
                            toastr.error(res.data.Message);
                        } else {
                            console.log(res.data.Data, 'get lesson')
                            $scope.formLesson = res.data.Data;
                            $scope.open('app/pages/CurriculumAdministration/popupLesson.html', 'lg');
                        }
                    })

                } else if (data.ActivityType == 'Quiz') {
                    CurriculumAdministrationSvc.getByIdQuiz(data.QuizId).then(function (res) {
                        if (res.data.ErrorCode !== 0) {
                            toastr.error(res.data.Message);
                        } else {
                            console.log(res.data.Data, 'get quiz')
                            $scope.formQuiz = res.data.Data;
                            $scope.open('app/pages/CurriculumAdministration/popupQuiz.html', 'lg');
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

                    CurriculumAdministrationSvc.getByIdAssignment(data.AssignmentId).then(function (res) {
                        if (res.data.ErrorCode !== 0) {
                            toastr.error(res.data.Message);
                        } else {
                            console.log(res.data.Data, 'get assignment')
                            $scope.formAssignment = res.data.Data;
                            $scope.open('app/pages/CurriculumAdministration/popupAssignment.html', 'lg');
                        }
                    })

                }
            }
        }

        //FUNGSI BARU
        $scope.showForm = function () { $scope.open('app/pages/CurriculumAdministration/Form.html', 'lg'); }
        $scope.showPopupActivity = function () {
            $scope.open('app/pages/CurriculumAdministration/popupActivity.html', 'md');
        }

        // FUNGSI BARU END
        $scope.form = {};
        $scope.doSave = function () {
            $loading.start('save');
            for (var i = 0; i < $scope.form.Details.length; i++) {
                $scope.form.Details[i].BottomRawScore = Number($scope.form.Details[i].BottomRawScore)
                $scope.form.Details[i].TopRawScore = Number($scope.form.Details[i].TopRawScore)
                $scope.form.Details[i].ConversionScore = Number($scope.form.Details[i].ConversionScore)
            }
            console.log($scope.form, 'formsave')
            CurriculumAdministrationSvc.create($scope.form).then(function (res) {
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
        $scope.doEdit = function () {
            console.log($scope.form, 'isi form')
            $loading.start('save');
            $scope.form.CurriculumPath = $scope.form.Path
            $scope.form.BranchName = 'PGD'
            // $scope.form.BranchProgramBranchName
            $scope.form.BranchCode = 'Pengadegan'
            // $scope.form.BranchProgramCode
            $scope.form.CurriculumId = $scope.form.Id
            $scope.form.Activities = $scope.form.Details
            for (var i = 0; i < $scope.form.Details.length; i++) {
                if ($scope.form.Details[i].selectedDifficulty !== undefined) {
                    $scope.form.Details[i].DifficultyId = $scope.form.Details[i].selectedDifficulty.Id
                    $scope.form.Details[i].DifficultyValue = $scope.form.Details[i].selectedDifficulty.Value
                    $scope.form.Details[i].CurriculumId = $scope.form.Id
                }
            }
            // for (var i = 0; i < $scope.form.Details.length; i++) {
            //     $scope.form.Details[i].BottomRawScore = Number($scope.form.Details[i].BottomRawScore)
            //     $scope.form.Details[i].TopRawScore = Number($scope.form.Details[i].TopRawScore)
            //     $scope.form.Details[i].ConversionScore = Number($scope.form.Details[i].ConversionScore)
            // }
            CurriculumAdministrationSvc.update($scope.form).then(function (res) {
                $loading.finish('save');
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                } else {
                    $scope.ToEdit();
                    toastr.success(res.data.Message);
                }
            });
        }
        $scope.doDelete = function () {
            var x = 0
            for (var i = 0; i < $scope.selected.length; i++) {
                CurriculumAdministrationSvc.delete($scope.selected[i]).then(function (res) {
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
                $scope.form.Details.splice(id, 1);
            } else if (state == 'lesson') {
                $scope.formLesson.LessonPages.splice(id, 1)
            }

        }
        $scope.getDifficulty = function () {
            return CurriculumAdministrationSvc.getDifficulty().then(function (res) {
                console.log(res.data.Data, 'difficulty')
                $scope.difficulty = res.data.Data
            })
        }
        $scope.getDifficulty();
        $scope.view_object = function (id) {

            $scope.form = id;
            $scope.getActivityTable();
        }
        $scope.getActivityTable = function () {
            $loading.start('save');
            $scope.isLoadingForm = true
            CurriculumAdministrationSvc.getActivity($scope.form.Id).then(function (res) {
                $loading.finish('save');
                $scope.isLoadingForm = false
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                } else {
                    console.log(res.data.Data, 'get activity')
                    $scope.form.Details = res.data.Data;

                    for (var i = 0; i < $scope.form.Details.length; i++) {

                        if ($scope.form.Details[i].AssignmentId != null) {
                            $scope.form.Details[i].ActivityName = $scope.form.Details[i].AssignmentName
                            $scope.form.Details[i].ActivityType = 'Assignment'
                        } else if ($scope.form.Details[i].LessonId != null) {
                            $scope.form.Details[i].ActivityName = $scope.form.Details[i].LessonName
                            $scope.form.Details[i].ActivityType = 'Lesson'
                        } else if ($scope.form.Details[i].QuizId != null) {
                            $scope.form.Details[i].ActivityName = $scope.form.Details[i].QuizName
                            $scope.form.Details[i].ActivityType = 'Quiz'
                        }
                        for (var j = 0; j < $scope.difficulty.length; j++) {
                            if ($scope.difficulty[j].Id == $scope.form.Details[i].DifficultyId) {
                                $scope.form.Details[i].selectedDifficulty = $scope.difficulty[j]
                            }
                        }
                    }

                }
            });
        }
        $scope.addRow = function (parameter) {
            $scope.addDetails = true
            $scope.controlDetails = true
            if (parameter == 'Lesson') {
                $scope.open('app/pages/CurriculumAdministration/popupLesson.html', 'lg');
                $scope.formLesson = {}
            } else if (parameter == 'Assignment') {
                $scope.open('app/pages/CurriculumAdministration/popupAssignment.html', 'lg');
                $scope.formAssignment = {}
            } else if (parameter == 'Quiz') {
                $scope.open('app/pages/CurriculumAdministration/popupQuiz.html', 'lg');
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
        $scope.showPopupLesson = function () {
            $scope.open('app/pages/CurriculumAdministration/popupActivity.html', 'md');
        }
        $scope.showPopupAddLesson = function (isNew) {
            $scope.EditlessonDetail = false
            $scope.open('app/pages/CurriculumAdministration/popupLessonAddPage.html', 'lg');
            if (isNew) {
                $scope.lessonDetail = {}
            }
        }
        $scope.setNextLesson = function (value) {
            $scope.NextLesson = value
            $scope.ToEdit();
            $scope.controlDetails = true;
            $scope.editDetails = true;
        }
        $scope.addNewLesson = function () {
            if ($scope.EditlessonDetail == false) {
                var newVar = { Sequence: 0, Title: $scope.lessonDetail.Title, content: $scope.lessonDetail.Content }
                if ($scope.formLesson.LessonPages == undefined) {
                    $scope.formLesson.LessonPages = []
                }
                if ($scope.lessonDetail.Title !== undefined) {
                    $scope.formLesson.LessonPages.push(newVar)
                }

            } else {
                $scope.formLesson.LessonPages[$scope.indexEditlessonDetail].Title = $scope.lessonDetail.Title
                $scope.formLesson.LessonPages[$scope.indexEditlessonDetail].Content = $scope.lessonDetail.Content
            }

            if ($scope.NextLesson == true) {
                $scope.lessonDetail = {}
            } else {
                $scope.dismissUibModal();
            }
        }

        $scope.SaveLesson = function () {

            var finalobj = {};
            for (var _obj in $scope.form) finalobj[_obj] = $scope.form[_obj];
            for (var _obj in $scope.formLesson) finalobj[_obj] = $scope.formLesson[_obj];
            $scope.formLesson = finalobj
            if ($scope.form.Details.length !== 0 || $scope.form.Details == undefined) {
                var maxSequence = Math.max.apply(Math, $scope.form.Details.map(function (o) { return o.Sequence; }))
            } else {
                var maxSequence = 0
            }

            $scope.formLesson.Sequence = maxSequence + 1
            $scope.formLesson.CurriculumPath = $scope.formLesson.Path
            $scope.formLesson.BranchCode = 'PGD'
            //  $scope.formLesson.BranchProgramBranchCode
            $scope.formLesson.BranchName = 'Pengadegan'
            $scope.formLesson.BranchProgramName = 'Pengadegan'
            $scope.formLesson.BranchProgramCode = 'PGD'
            $scope.formLesson.CurriculumId = $scope.form.Id
            // $scope.formLesson.BranchProgramBranchName
            $scope.formLesson.Session = 1
            console.log($scope.formLesson, 'isi save')


            if ($scope.addDetails) {
                CurriculumAdministrationSvc.createLesson($scope.formLesson).then(function (res) {
                    if (res.data.ErrorCode !== 0) {
                        toastr.error(res.data.Message);

                    } else {
                        toastr.success(res.data.Message);
                        $scope.getActivityTable();
                        $scope.dismissUibModal();
                    }
                    $loading.finish('save');
                    // $scope.loading = false;
                });

            } else if ($scope.addDetails == false) {
                // $scope.formLesson.BranchCode = $scope.form.BranchProgramBranchCode
                // $scope.formLesson.CurriculumName = $scope.form.CurriculumName
                // $scope.formLesson.BranchProgramName = 'PGD'
                // $scope.form.BranchProgramName
                // $scope.formLesson.BranchProgramCode = 'Pengadegan'
                // $scope.form.BranchProgramCode
                console.log($scope.formLesson, 'isi assignment')
                CurriculumAdministrationSvc.updateLesson($scope.formLesson).then(function (res) {
                    if (res.data.ErrorCode !== 0) {
                        toastr.error(res.data.Message);
                    } else {
                        toastr.success(res.data.Message);
                        $scope.getActivityTable();
                        $scope.dismissUibModal();
                    }
                    $loading.finish('save');
                    // $scope.loading = false;
                });
            }
        }
        $scope.viewLessonDetail = function (data, index) {
            console.log(data)
            $scope.indexEditlessonDetail = index
            $scope.EditlessonDetail = true
            $scope.lessonDetail = data
            $scope.open('app/pages/CurriculumAdministration/popupLessonAddPage.html', 'lg');
        }
        $scope.SaveAssignment = function () {
            var finalobj = {};
            for (var _obj in $scope.form) finalobj[_obj] = $scope.form[_obj];
            for (var _obj in $scope.formAssignment) finalobj[_obj] = $scope.formAssignment[_obj];
            $scope.formAssignment = finalobj
            if ($scope.form.Details.length !== 0 || $scope.form.Details == undefined) {
                var maxSequence = Math.max.apply(Math, $scope.form.Details.map(function (o) { return o.Sequence; }))
            } else {
                var maxSequence = 0
            }
            $scope.formAssignment.Sequence = maxSequence + 1
            $scope.formAssignment.CurriculumPath = $scope.formAssignment.Path
            $scope.formAssignment.BranchCode = 'PGD'
            // $scope.formAssignment.BranchProgramBranchCode
            $scope.formAssignment.BranchName = 'Pengadegan'
            $scope.formAssignment.BranchProgramName = 'Pengadegan'
            $scope.formAssignment.BranchProgramCode = 'PGD'
            // $scope.formAssignment.BranchProgramBranchName
            $scope.formAssignment.Session = 1
            $scope.formAssignment.MaxGradeValue = parseInt($scope.formAssignment.MaxGradeValue)
            $scope.formAssignment.MinGradeValue = parseInt($scope.formAssignment.MinGradeValue)
            $scope.formAssignment.GradeToPassValue = parseInt($scope.formAssignment.GradeToPassValue)
            $scope.formAssignment.GradeWeight = parseInt($scope.formAssignment.GradeWeight)
            $scope.formAssignment.CurriculumId = $scope.form.Id

            if ($scope.addDetails) {
                CurriculumAdministrationSvc.createAssignment($scope.formAssignment).then(function (res) {
                    if (res.data.ErrorCode !== 0) {
                        toastr.error(res.data.Message);
                    } else {
                        toastr.success(res.data.Message);
                        $scope.getActivityTable();
                        $scope.dismissUibModal();
                    }
                    $loading.finish('save');
                    // $scope.loading = false;
                });
            } else if ($scope.addDetails == false) {
                $scope.formAssignment.BranchCode = $scope.form.BranchProgramBranchCode
                $scope.formAssignment.CurriculumName = $scope.form.CurriculumName
                $scope.formAssignment.BranchProgramName = 'PGD'
                // $scope.form.BranchProgramName
                $scope.formAssignment.BranchProgramCode = 'Pengadegan'
                // $scope.form.BranchProgramCode
                console.log($scope.formAssignment, 'isi assignment')
                CurriculumAdministrationSvc.updateAssignment($scope.formAssignment).then(function (res) {
                    if (res.data.ErrorCode !== 0) {
                        toastr.error(res.data.Message);
                    } else {
                        toastr.success(res.data.Message);
                        $scope.getActivityTable();
                        $scope.dismissUibModal();
                    }
                    $loading.finish('save');
                    // $scope.loading = false;
                });
            }


        }

        // Popup Create Quiz
        $scope.SaveQuiz = () => {
            var finalobj = {};
            for (var _obj in $scope.form) finalobj[_obj] = $scope.form[_obj];
            for (var _obj in $scope.formQuiz) finalobj[_obj] = $scope.formQuiz[_obj];
            $scope.formQuiz = finalobj
            if ($scope.form.Details.length !== 0 || $scope.form.Details == undefined) {
                var maxSequence = Math.max.apply(Math, $scope.form.Details.map(function (o) { return o.Sequence; }))
            } else {
                var maxSequence = 0
            }
            $scope.formQuiz.Sequence = maxSequence + 1
            $scope.formQuiz.CurriculumPath = $scope.formQuiz.Path
            $scope.formQuiz.BranchCode = 'PGD'
            // $scope.formQuiz.BranchProgramBranchCode
            $scope.formQuiz.BranchName = 'Pengadegan'
            $scope.formQuiz.BranchProgramName = 'Pengadegan'
            $scope.formQuiz.BranchProgramCode = 'PGD'
            // $scope.formQuiz.BranchProgramBranchName
            $scope.formQuiz.Session = 1
            $scope.formQuiz.MaxGradeValue = parseInt($scope.formQuiz.MaxGradeValue)
            $scope.formQuiz.MinGradeValue = parseInt($scope.formQuiz.MinGradeValue)
            $scope.formQuiz.GradeToPassValue = parseInt($scope.formQuiz.GradeToPassValue)
            $scope.formQuiz.GradeWeight = parseInt($scope.formQuiz.GradeWeight)
            $scope.formQuiz.GradeConversionId = $scope.formQuiz.ScoreConversion.Id
            $scope.formQuiz.CurriculumId = $scope.form.Id

            if ($scope.formQuiz.Questions !== undefined) {
                $scope.formQuiz.QuizQuestionsMultiple = $scope.formQuiz.Questions
                for (var i = 0; i < $scope.formQuiz.QuizQuestionsMultiple.length; i++) {
                    $scope.formQuiz.QuizQuestionsMultiple[i].WrongPoint = parseFloat($scope.formQuiz.QuizQuestionsMultiple[i].WrongPoint)
                    $scope.formQuiz.QuizQuestionsMultiple[i].RightPoint = parseFloat($scope.formQuiz.QuizQuestionsMultiple[i].RightPoint)
                    $scope.formQuiz.QuizQuestionsMultiple[i].Answer = $scope.formQuiz.QuizQuestionsMultiple[i].Answer.Choice
                    $scope.formQuiz.QuizQuestionsMultiple[i].ShortAnswer = $scope.formQuiz.QuizQuestionsMultiple[i].Answer
                    $scope.formQuiz.QuizQuestionsMultiple[i].QuizName = $scope.formQuiz.Name

                }
            } else {
                $scope.formQuiz.QuizQuestionsMultiple = []
            }
            if ($scope.formQuiz.QuestionsTOF !== undefined) {
                $scope.formQuiz.QuizQuestionsTrueFalse = $scope.formQuiz.QuestionsTOF
                for (var i = 0; i < $scope.formQuiz.QuizQuestionsTrueFalse.length; i++) {
                    $scope.formQuiz.QuizQuestionsTrueFalse[i].Point = parseFloat($scope.formQuiz.QuizQuestionsTrueFalse[i].Point)
                    $scope.formQuiz.QuizQuestionsTrueFalse[i].QuizName = $scope.formQuiz.Name
                }
            } else {
                $scope.formQuiz.QuizQuestionsTrueFalse = []
            }
            if ($scope.formQuiz.QuestionsSA !== undefined) {
                $scope.formQuiz.QuizQuestionsShortAnswer = $scope.formQuiz.QuestionsSA
                for (var i = 0; i < $scope.formQuiz.QuizQuestionsShortAnswer.length; i++) {
                    $scope.formQuiz.QuizQuestionsShortAnswer[i].Point = parseFloat($scope.formQuiz.QuizQuestionsShortAnswer[i].Point)
                    $scope.formQuiz.QuizQuestionsShortAnswer[i].QuizName = $scope.formQuiz.Name
                }
            } else {
                $scope.formQuiz.QuizQuestionsShortAnswer = []
            }


            console.log($scope.formQuiz, 'isi form quiz')
            CurriculumAdministrationSvc.createQuiz($scope.formQuiz).then(function (res) {
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                } else {
                    toastr.success(res.data.Message);
                    $scope.getActivityTable();
                    $scope.dismissUibModal();
                }
                $loading.finish('save');
                // $scope.loading = false;
            });
        }
        var getScoreConversion = () => {
            CurriculumAdministrationSvc.getScoreConversions().then(function (res) {
                if (res.data.ErrorCode == 0) {
                    $scope.ScoreConversion = res.data.Data;
                } else {
                    toastr.error(res.data.Message)
                }
            })
        }
        getScoreConversion();
        $scope.showFormAddQuestion = () => {
            $scope.addQuize={};
            $scope.open('app/pages/CurriculumAdministration/popupQuizAdd.html', 'xlg');
            $scope.addQuize.QuizQuestionsMultipleChoices=[];
            $scope.indexQ = $scope.formQuiz.Questions.length - 1;
            $scope.addQuize.QuizQuestionsMultipleChoices.push({ Choice: "A" })
            $scope.huruf = 1;
        }
        $scope.pushToQuiz=()=>{
            $scope.formQuiz.Questions.push($scope.addQuize);
        }
        $scope.huruf = 1;
        $scope.addChoises = () => {
            $scope.huruf++;
            switch ($scope.huruf) {
                case 1:
                    var label = "A"
                    break;
                case 2:
                    var label = "B"
                    break;
                case 3:
                    var label = "C"
                    break;
                case 4:
                    var label = "D"
                    break;
                case 5:
                    var label = "E"
                    break;
                default:
                    break;
            }
            $scope.addQuize.QuizQuestionsMultipleChoices.push({ Choice: label })
        }
        $scope.addRowQuiz = (state) => {
            if (state == 'TOF') {
                for (let i = 0; i < $scope.TrueOrFalseRow; i++) {
                    $scope.formQuiz.QuestionsTOF.push({});
                }
            } else if (state == 'SA') {
                for (let i = 0; i < $scope.ShortAnswerRow; i++) {
                    $scope.formQuiz.QuestionsSA.push({});
                }

            }
        }
        $scope.deleteQuestions = (index, state) => {
            if (state == 'Quiz') {
                $scope.formQuiz.Questions.splice(index, 1);
            } else if (state == 'TOF') {
                $scope.formQuiz.QuestionsTOF.splice(index, 1);
            } else if (state == 'SA') {
                $scope.formQuiz.QuestionsSA.splice(index, 1);
            }
        }

        $scope.activeTabIndex = 0
        $scope.tabs = [{ title: 'Session 1', index: 1 }];

        $scope.addTab = function () {
            var newTab = { title: 'Session ' + ($scope.tabs.length + 1), index: $scope.tabs.length + 1 };
            $scope.tabs.push(newTab);
            $timeout(function () {
                $scope.activeTabIndex = ($scope.tabs.length - 1);
            });

            console.log($scope.activeTabIndex);
        };
        $scope.setSession = function (index) {
            $scope.form.SelectedSession = index
        }
        // Tutup Quiz
        CurriculumAdministrationSvc.getQuiz().then(function (res) {
            console.log(res);
        });
    }
})();