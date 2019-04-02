
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.CurriculumAdministration', [])
        .factory('CurriculumAdministrationSvc', function ($http, config) {
            return {
                //service
                getlist: function (limit, offset, params) {
                    var url = config.api + "mastercurriculum";
                    var criteria = params.search.predicateObject == undefined ? "?criteria=IsLeaf:true" : '?criteria=IsLeaf:true,' + config.paramsSearch(params);
                    var limit = '&limit=' + limit;
                    // var offset = '&page=' + parseInt(offset + 1);
                    var offset = '&page=' + offset;
                    var sort = params.sort.predicate == undefined ? "&sortBy=Id:asc" : '&sortBy=' + config.paramsSort(params);
                    var final = url + criteria + limit + offset + sort;
                    // console.log(final);
                    return $http.get(final);
                },
                create: function (data) {
                    var url = config.apiLRN + 'curriculumadministration';
                    return $http.post(url, data)
                },
                delete: function (id) {
                    var url = config.apiLRN + 'curriculumadministration?id=' + id;
                    return $http.delete(url);
                },
                update: function (data) {
                    var url = config.apiElearning + 'curriculumactivities';
                    return $http.put(url, data)
                },
                getById: function (id) {
                    var url = config.apiLRN + 'curriculumadministration?id=' + id
                    return $http.get(url)
                },
                getFasilitas: function () {
                    var url = config.api + 'facility';
                    return $http.get(url)
                },
                getBranch: function () {
                    var url = config.apiGeneral + 'branch?criteria=UnitId:1';
                    return $http.get(url)
                },
                getProgram: function (branchId) {
                    var url = config.api + 'branchprogram?criteria=BranchId:' + branchId + ',IsLeaf:true';
                    return $http.get(url)
                },
                getSlotDay: function (branchId) {
                    var url = config.api + 'slotday?criteria=BranchId:' + branchId;
                    return $http.get(url)
                },
                getTeacher: function (branchId, isAOO) {
                    if (isAOO == true) {
                        var url = config.apiLRN + 'Teacher?Criteria=IsAOO:true';
                    } else {
                        var url = config.apiLRN + 'teacher';
                    }


                    return $http.get(url)
                },
                getStudent: function (branchId) {
                    var url = config.apiLRN + 'student';
                    return $http.get(url)
                },
                getStatus: function () {
                    var url = config.apiGeneral + 'enumeration?criteria=Key:BranchClassStatus';
                    return $http.get(url)
                },
                getCuriculum: function () {
                    var url = config.apiGeneral + 'enumeration?criteria=Key:BranchClassStatus';
                    return $http.get(url)
                },
                createLesson: function (data) {
                    var url = config.apiElearning + 'lesson';
                    return $http.post(url, data)
                },
                updateLesson: function (data) {
                    var url = config.apiElearning + 'lesson';
                    return $http.put(url, data)
                }, 
                getByIdLesson: function (id) {
                    var url = config.apiElearning + 'lesson?id=' + id
                    return $http.get(url)
                },                 
                createAssignment: function (data) {
                    var url = config.apiElearning + 'assignment';
                    return $http.post(url, data)
                },
                updateAssignment: function (data) {
                    var url = config.apiElearning + 'assignment';
                    return $http.put(url, data)
                }, 
                getByIdAssignment: function (id) {
                    var url = config.apiElearning + 'assignment?id=' + id
                    return $http.get(url)
                },                               
                createQuiz: function (data) {
                    var url = config.apiElearning + 'quiz';
                    return $http.post(url, data)
                }, 
                updateQuiz: function (data) {
                    var url = config.apiElearning + 'quiz';
                    return $http.put(url, data)
                }, 
                getByIdQuiz: function (id) {
                    var url = config.apiElearning + 'quiz?id=' + id
                    return $http.get(url)
                },                                  
                // Quiz
                getScoreConversions: function () {
                    var url = config.apiLRN + 'scoreconversion';
                    return $http.get(url)
                },
                getActivity:function (curriculumId){
                    var url = config.apiElearning + 'activity?Criteria=CurriculumId:' + curriculumId+"&sortBy=Sequence:asc";
                    return $http.get(url)                    
                },
                getQuiz: function () {
                    var url = config.apiElearning + 'quiz';
                    return $http.get(url)
                },       
                getDifficulty: function () {
                    var url = config.apiGeneral + 'enumeration?criteria=Key:ElearningActivityDifficulty';
                    return $http.get(url)
                }                         
            };
        })
        .config(routeConfig);
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('CurriculumActivities', {
                url: '/curriculum-activities',
                title: 'Curriculum Activities',
                templateUrl: 'app/pages/CurriculumAdministration/List.html',
                controller: 'CurriculumAdministrationCtrl',
            })
    }
})();