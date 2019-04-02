function rowSelect() {
    return {
        require: '^stTable',
        template: '<input type="checkbox" class="s-row-select">',
        scope: {
            row: '=rowSelect'
        },
        link: function (scope, element, attr, ctrl, prop) {
            element.bind('click', function (evt) {
                scope.$apply(function () {
                    ctrl.select(scope.row, 'multiple');
                });
            });
            // console.log(element);
            scope.$watch('row.isSelected', function (newValue) {
                if (newValue === true) {
                    element.parent().addClass('st-selected');
                    element.find('input').prop('checked', true);
                } else {
                    element.parent().removeClass('st-selected');
                    element.find('input').prop('checked', false);
                }
            });
        }
    };
}
// /** @ngInject */zasa
function incScheduler() {
    return {
        templateUrl: 'app/pages/schedule/schedule-template.html',
        link: function ($scope, elem, attr) {
            $scope.indexMonths = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            $scope.scheduleSch = [];

            $scope.toggleRow = function (x) {
                x.expanded = !x.expanded;
            }

            function getRandomColor() {
                var letters = '0123456789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }

            function validate() {
                if ($scope.dateSch.start == "" || $scope.dateSch.start == undefined) {
                    alert("start date must be filled !");
                    return;
                }
                if ($scope.dateSch.end == "" || $scope.dateSch.end == undefined) {
                    alert("End date must be filled !");
                    return;
                }
                return true;
            }

            function resolveSchedule(start, end) {
                var current = angular.copy(start);
                current.setDate(1);
                end.setDate(1);

                var sch = [];
                while (current.getTime() <= end.getTime()) {
                    console.log(current.getMonth());
                    var x = {
                        month: current.getMonth(),
                        year: current.getFullYear(),
                        numberOfDays: getDaysInMonth(current)
                    };
                    sch.push(x);

                    current.setMonth(current.getMonth() + 1);
                }
                return sch;
            }



            function getDaysInMonth(x) {
                var date = angular.copy(x);
                var i = 0;
                const month = date.getMonth();
                while (date.getMonth() == month) {
                    i++;
                    date.setDate(date.getDate() + 1);
                }
                return i;
            }

            $scope.check = function (data, day, schedule) {
                var date = new Date(schedule.year, schedule.month, day);
                var res;
                console.log(data);
                if (date.getDay() == 0) {
                    res = "weekend";
                } else if (data == null) {
                    return;
                } else {
                    for (var i in data.events) {
                        var eventDate = data.events[i].start;
                        console.log(eventDate, date);
                        if (eventDate.getTime() == date.getTime()) {
                            res = "active";
                            break;
                        }
                    }
                }

                if (res == "weekend") {
                    alert("weekend");
                } else if (res == "active") {
                    alert("active");
                }
            }

            $scope.inspectDay = function (data, day, schedule) {
                var date = new Date(schedule.year, schedule.month, day);
                var res;
                if (date.getDay() == 0) {
                    res = "weekend";
                } else if (data == null) {
                    return;
                } else {
                    for (var i in data.events) {
                        var eventDate = data.events[i].start;
                        if (eventDate.getTime() == date.getTime()) {
                            res = "active";
                            break;
                        }
                    }
                }

                if (res == "weekend") {
                    return "gray";
                } else if (res == "active") {
                    return data.color;
                }
            }

            function resolveColor(data) {
                for (var i in data) {
                    for (var j in data[i].children) {
                        for (var k in data[i].children[j].children) {
                            var x = data[i].children[j].children[k];
                            x.color = getRandomColor();
                        }
                    }
                }
                return data;
            }

            $scope.generateScheduler = function () {
                $scope.dateSch = $scope.schDate;
                if (!validate()) {
                    return;
                };

                $scope.scheduleSch = resolveSchedule(new Date($scope.schDate.start), new Date($scope.schDate.end));
                $scope.dataSch = resolveColor($scope.schData);
            }
        }
    };
}

function rowSelectAll($rootScope) {
    return {
        require: '^stTable',
        template: '<input type="checkbox" class="top-min-11">',
        scope: {
            all: '=rowSelectAll',
            selected: '='
        },
        link: function (scope, element, attr, prop) {
            scope.isAllSelected = false;
            element.bind('click', function (evt) {
                scope.$apply(function () {
                    scope.all.forEach(function (val) {
                        val.isSelected = scope.isAllSelected;
                    });
                });
            });
            $rootScope.selectReset = function () {
                element.find('input').prop('checked', false);
                scope.isAllSelected = true;
                scope.all.forEach(function (val) {
                    val.isSelected = false;
                });
                scope.selected = [];
            }
            scope.$watchCollection('selected', function (newVal) {
                var s = newVal.length;
                var a = scope.all.length;
                if ((s == a) && s > 0 && a > 0) {
                    element.find('input').prop('checked', true);
                    scope.isAllSelected = false;
                } else {
                    element.find('input').prop('checked', false);
                    scope.isAllSelected = true;
                }
            });

        }
    };
}

(function () {
    'use strict';
    angular.module('BlurAdmin.pages', [
        'ui.router',
        'BlurAdmin.pages.dashboard',
        'BlurAdmin.pages.CourseForm',
        'BlurAdmin.pages.CourseList',
        'BlurAdmin.pages.TopicForm',
        'BlurAdmin.pages.LessonActivity',
        'BlurAdmin.pages.ContentPages',
        'BlurAdmin.pages.CurriculumAdministration',
        'BlurAdmin.pages.Test',
        'BlurAdmin.pages.SessionActivity',
        'BlurAdmin.pages.Grading',
        'BlurAdmin.pages.Resource',
        'BlurAdmin.pages.ResourceTag',
        'BlurAdmin.pages.ResourceCategory',




    ])
        .factory('AuthenticationSvc', function ($http, config) {
            return {
                //service
                Authentication: function (data) {
                    var url = config.apiUserManagement + 'authtoken';
                    return $http.post(url, data)    
                },
                getById: function (key) {
                    var url = config.apiGeneral + 'enumeration?Criteria=Key:' + key
                    return $http.get(url)
                },
            };
        })
        .directive('incScheduler', incScheduler)
        .directive('fileModel', ['$parse', function ($parse) {      
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var model = $parse(attrs.fileModel);
                    console.log("masuk pak eko")
                    var modelSetter = model.assign;
                    element.bind('change', function () {
                        scope.$apply(function () {
                            modelSetter(scope, element[0].files[0]);
                        });
                    });
                }
            };
        }])
        .directive('sglclick', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    var fn = $parse(attr['sglclick']);
                    var delay = 300,
                        clicks = 0,
                        timer = null;
                    element.on('click', function (event) {
                        clicks++; //count clicks
                        if (clicks === 1) {
                            timer = setTimeout(function () {
                                scope.$apply(function () {
                                    fn(scope, { $event: event });
                                });
                                clicks = 0; //after action performed, reset counter
                            }, delay);
                        } else {
                            clearTimeout(timer); //prevent single-click action
                            clicks = 0; //after action performed, reset counter
                        }
                    });
                }
            };
        }])
        .directive('checkList', function () {
            return {
                scope: {
                    list: '=checkList',
                    value: '@'
                },
                link: function (scope, elem, attrs) {
                    var handler = function (setup) {
                        var checked = elem.prop('checked');
                        var index = scope.list.indexOf(scope.value);
                        if (checked && index == -1) {
                            if (setup) elem.prop('checked', false);
                            else scope.list.push(scope.value);
                        } else if (!checked && index != -1) {
                            if (setup) elem.prop('checked', true);
                            else scope.list.splice(index, 1);
                        }
                    };

                    var setupHandler = handler.bind(null, true);
                    var changeHandler = handler.bind(null, false);

                    elem.on('change', function () {
                        scope.$apply(changeHandler);
                    });
                    scope.$watch('list', setupHandler, true);
                }
            };
        })
        .filter('range', function () {
            return function (input, total) {
                total = parseInt(total);
                for (var i = 0; i < total; i++)
                    input.push(i);
                return input;
            };
        })
        .directive('numericOnly', function ($filter) {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, modelCtrl) {
                    function numberLoad() {
                        var strinput = modelCtrl.$$rawModelValue;
                        //filter user input
                        var transformedInput = strinput ? strinput.replace(/[^,\d,-]/g, '') : null;
                        //remove trailing 0
                        if (transformedInput.charAt(0) <= '0') {
                            transformedInput = null;
                            modelCtrl.$setViewValue(transformedInput);
                            modelCtrl.$render();
                        } else {
                            var decimalSplit = transformedInput.split(",")
                            var intPart = decimalSplit[0];
                            var decPart = decimalSplit[1];
                            //remove previously formated number
                            intPart = intPart.replace(/,/g, "");
                            //split whole number into array of 3 digits
                            if (intPart.length > 3) {
                                var intDiv = Math.floor(intPart.length / 3);
                                var strfraction = [];
                                var i = intDiv,
                                    j = 3;

                                while (intDiv > 0) {
                                    strfraction[intDiv] = intPart.slice(intPart.length - j, intPart.length - (j - 3));
                                    j = j + 3;
                                    intDiv--;
                                }
                                var k = j - 3;
                                if ((intPart.length - k) > 0) {
                                    strfraction[0] = intPart.slice(0, intPart.length - k);
                                }
                            }
                            //join arrays
                            if (strfraction == undefined) {
                                return;
                            }
                            var currencyformat = strfraction.join('.');
                            //check for leading comma
                            if (currencyformat.charAt(0) == '.') {
                                currencyformat = currencyformat.slice(1);
                            }

                            if (decPart == undefined) {
                                modelCtrl.$setViewValue(currencyformat);
                                modelCtrl.$render();
                                return;
                            } else {
                                currencyformat = currencyformat + "," + decPart.slice(0, 2);
                                modelCtrl.$setViewValue(currencyformat);
                                modelCtrl.$render();
                            }
                        }
                    }
                    element.bind('keyup', function (inputValue, e) {
                        numberLoad();
                    });
                    element.ready(function (inputValue, e) {
                        numberLoad();
                    });
                }
            }
        })
        .filter("formatPrice", function () {
            return function (price, digits, thoSeperator, decSeperator, bdisplayprice) {
                var i;
                digits = (typeof digits === "undefined") ? 2 : digits;
                bdisplayprice = (typeof bdisplayprice === "undefined") ? true : bdisplayprice;
                thoSeperator = (typeof thoSeperator === "undefined") ? "." : thoSeperator;
                decSeperator = (typeof decSeperator === "undefined") ? "," : decSeperator;
                price = price.toString();
                var _temp = price.split(".");
                var dig = (typeof _temp[1] === "undefined") ? "00" : _temp[1];
                if (bdisplayprice && parseInt(dig, 10) === 0) {
                    dig = "-";
                } else {
                    dig = dig.toString();
                    if (dig.length > digits) {
                        dig = (Math.round(parseFloat("0." + dig) * Math.pow(10, digits))).toString();
                    }
                    for (i = dig.length; i < digits; i++) {
                        dig += "0";
                    }
                }
                var num = _temp[0];
                var s = "",
                    ii = 0;
                for (i = num.length - 1; i > -1; i--) {
                    s = ((ii++ % 3 === 2) ? ((i > 0) ? thoSeperator : "") : "") + num.substr(i, 1) + s;
                }
                return s;
                // return s + decSeperator + dig;
            }
        })

        .directive('rowSelect', rowSelect)
        .directive('rowSelectAll', rowSelectAll)

        .directive('contextMenu', function ($timeout) {
            return {
                restrict: 'A',
                scope: '@&',
                compile: function compile(tElement, tAttrs, transclude) {
                    return {
                        post: function postLink(scope, iElement, iAttrs, controller) {
                            var ul;
                            var last = null;
                            // ul.css({ 'display': 'none' });
                            $(iElement).on('contextmenu', function (event) {
                                event.preventDefault();
                                // $("a.jstree-anchor").removeClass('jstree-clicked');
                                var newId = $(iElement).data('id');
                                scope.saveId(newId);

                                if (typeof iAttrs.custom === 'undefined') {
                                    var newValue = $(iElement).find('input').prop('checked');
                                    var selected = scope.selected.length;

                                    if (newValue == false) {
                                        if (selected == 1) {
                                            $timeout(function () {
                                                $(".custom-table").find('.s-row-select').each(function () {
                                                    var prop = $(this).prop('checked');
                                                    if (prop == true) {
                                                        $(this).parent().triggerHandler("click");
                                                    }
                                                });
                                            });
                                        }
                                    }
                                    if (newValue === false) {
                                        $timeout(function () {
                                            $(iElement).find('.row-select').triggerHandler("click");
                                        });
                                    }
                                    ul = $('#' + iAttrs.contextMenu);
                                } else {
                                    if ($(this).is(".jstree-clicked")) {
                                        var setShow = true;
                                    } else {
                                        var setShow = false;
                                    }
                                    $timeout(function () {
                                        scope.contextmenu(iAttrs.custom, setShow);
                                        ul = $('#' + iAttrs.contextMenu);
                                    });
                                    $(this).addClass('jstree-clicked2');
                                }
                                $timeout(function () {
                                    var X = event.clientX;
                                    var Y = event.clientY;
                                    ul.css({
                                        display: "block",
                                        position: "fixed",
                                        top: Y + 'px',
                                        left: X + 'px'
                                    });
                                    last = event.timeStamp;
                                })


                            });
                            $(document).on('click', function (event) {
                                ul = $('#' + iAttrs.contextMenu);
                                var target = $(event.target);
                                if (!target.is(".popover") && !target.parents().is(".popover")) {
                                    if (last === event.timeStamp)
                                        return;
                                    ul.css({
                                        'display': 'none'
                                    });
                                    $(iElement).removeClass('jstree-clicked2');
                                }
                            });
                        }
                    };
                }
            };
        })
        .factory('lia', function ($timeout, $uibModal, toastr, $filter, $state, $window) {
            var self = {};
            self.jstree = function ($scope) {
                var refreshJs = function () {
                    angular.element(document).injector().invoke(function ($compile) {
                        $compile($("#js-tree").contents())($scope);
                    });
                }
                $scope.$watch(
                    function () {
                        return {
                            w: $("#js-tree").width(),
                            h: $("#js-tree").height()
                        };
                    },
                    function (newValue, oldValue) {
                        if (newValue.w != oldValue.w || newValue.h != oldValue.h) {
                            // Do something ...
                            $timeout(function () {
                                refreshJs();
                            });
                        }
                    },
                    true
                );
            }
            self.init = function ($scope, data) {
                $scope.form = {};
                $scope.view_object = function (id) {
                    $scope.form = {};
                    var selected;
                    selected = id == undefined ? $scope.getId : id;
                    // if (typeof $scope.getParams == "undefined") {
                    //     var obj = self.viewByAttr(data, 'id', selected);
                    //     $scope.form.id = selected;
                    // } else {
                    var obj = self.viewByAttr(data, $scope.getParams, selected);
                    // }
                    $scope.form = obj;
                    console.log(selected)
                };
                $scope.doEdit = function () {
                    if (typeof $scope.getParams == "undefined") {
                        var id = $scope.form.id;
                    } else {
                        var id = $scope.form[$scope.getParams];
                    }
                    var index = data.findIndex(x => x.id === id);
                    data[index] = $scope.form;
                    console.log(id);
                    $scope.showEditMsg();
                }
                $scope.doDelete = function () {
                    var id = $scope.selected.length;
                    if (typeof $scope.getParams == "undefined") {
                        while (id--) {
                            self.removeByAttr(data, 'id', $scope.selected[id]);
                        }
                    } else {
                        while (id--) {
                            self.removeByAttr(data, $scope.getParams, $scope.selected[id]);
                        }
                    }
                    $scope.selected = [];
                    $scope.showDeleteMsg();
                    // console.log(id);
                }
            }
            self.select_control = function ($scope) {
                $scope.selected = [];
                $scope.selectedByAttr = [];
                $scope.selectAll = function (collection, attr = 'Id') {
                    self.selectAll($scope, collection, attr);
                };
                $scope.select = function (id) {
                    self.select($scope, id);
                }
            }
            self.behaviour = function ($scope) {
                $scope.loading = false;
                $scope.saveId = function (newId) {
                    $scope.getId = newId.toString();
                }
                $scope.showSuccessMsg = function () {
                    toastr.success("Data Berhasil Di Save");
                }
                $scope.showEditMsg = function () {
                    toastr.success("Data Berhasil Di Edit");
                }
                $scope.showDeleteMsg = function () {
                    toastr.success("Data Berhasil Di Hapus");
                }
                var full_control = function () {
                    $scope.control = true;
                    $scope.add = false;
                    $scope.edit = false;
                    $scope.edits = false;
                    $scope.view = false;
                }
                $scope.behaviour_add = function () {
                    $scope.form = {};
                    full_control();
                    $scope.add = true;
                }
                $scope.behaviour_view = function () {
                    $scope.selected = [];
                    full_control();
                    $scope.control = false;
                    $scope.view = true;
                }
                $scope.behaviour_edit = function () {
                    full_control();
                    $scope.edit = true;
                }
            }
            self.modal = function ($scope) {
                $scope.doRefresh = function () {
                    $window.location.reload();
                }
                $scope.showError = function () {
                    // $uibModal.open({
                    //     animation: true,
                    //     template: '<div class="modal-content modal-delete"> <div class="modal-body"> <p>Mohon Maaf, Ada Kesalahan Dalam Memuat Data</p> </div> <div class="modal-footer"><button ng-click="doRefresh();" class="btn btn-danger">Muat Ulang</button></div> </div>',
                    //     size: 'sm',
                    //     scope: $scope
                    // });
                }
                $scope.open = function (page, size) {
                    // $scope.selected = [];
                    var modal = $uibModal.open({
                        animation: true,
                        templateUrl: page,
                        size: size,
                        scope: $scope,
                        controller: function ($scope, $uibModalInstance, $rootScope) {
                            $rootScope.closemodal = function () {
                                $uibModalInstance.dismiss('cancel');
                            }
                        },
                        resolve: {
                            items: function () {
                              return $scope.items;
                            }
                          }
                    }).closed.then(function(){
                        $scope.selected=[];
                        angular.element('.st-selected').removeClass("st-selected");
                        angular.element('.s-row-select').prop("checked", false);
                        $scope.results.forEach(function (val) {
                            val.isSelected = false;
                        });
                    });
                };
                $scope.openDelete = function (page, size) {
                    var modal = $uibModal.open({
                        animation: true,
                        template: '<div class="modal-content modal-delete"> <div class="modal-body"> <p>Are you sure want to delete selected data?</p> </div> <div class="modal-footer"><button class="btn btn-default" ng-click="$close()">No</button> <button ng-click="doDelete();$close();" class="btn btn-danger">Yes</button></div> </div>',
                        size: 'sm',
                        scope: $scope
                    });
                };
            }
            self.selectAll = function (scope, collection, attr = 'Id') {
                if (scope.selected.length === 0) {
                    angular.forEach(collection, function (val) {
                        scope.selected.push(val[attr]);
                    });
                } else if (scope.selected.length > 0 && scope.selected.length != collection.length) {
                    angular.forEach(collection, function (val) {
                        var found = scope.selected.indexOf(val[attr]);
                        if (found == -1) scope.selected.push(val[attr]);
                    });
                } else {
                    scope.selected = [];
                }
            }
            self.select = function (scope, id) {
                var found = scope.selected.indexOf(id);
                if (found == -1) scope.selected.push(id);
                else scope.selected.splice(found, 1);
            }
            self.removeByAttr = function (arr, attr, value) {
                var i = arr.length;
                while (i--) {
                    if (arr[i] &&
                        arr[i].hasOwnProperty(attr) &&
                        (arguments.length > 2 && arr[i][attr] === value)) {
                        arr.splice(i, 1);
                    }
                }
                return arr;
            }
            self.viewByAttr = function (arr, attr, value) {
                var i = arr.length;
                while (i--) {
                    if (arr[i] &&
                        arr[i].hasOwnProperty(attr) &&
                        (arguments.length > 2 && arr[i][attr] === value)) {
                        // arr.splice(i, 1);
                        return angular.copy(arr[i]);
                    }
                }

            };
            self.contextmenu = function ($scope, custom = [], privileges) {
				var induk = "";
				induk += '<ul id="menuOptions" class="dropdown-menu context-menu" style="min-width:130px !important;border-radius:0;cursor:pointer !important;"></ul>';
				$("#context").html(induk);
				$scope.$watchCollection('selected', function (newVal, oldVal) {
					var html = "";
					if (custom.length > 0) {
						if (custom.indexOf('setuju') != -1) html += '<li><a ng-click="doSetuju()"><i class="fa fa-check text-success"></i>  Approve</a></li>';
						if (custom.indexOf('tolak') != -1) html += '<li><a ng-click="doTolak()"><i class="fa fa-close text-warning"></i>  Reject</a></li>';
						if ($scope.selected.length == 1 && (privileges != undefined && privileges.CanUpdate)) {
							if (custom.indexOf('edit') != -1) html += '<li><a ng-click="showForm();behaviour_edit();view_object();"><i class="fa fa-edit text-primary"></i>  Edit</a></li>';
						}
						if (custom.indexOf('hapus') != -1 && (privileges != undefined && privileges.CanDelete)) html += '<li><a ng-click="openDelete()"><i class="fa fa-trash text-danger"></i>  Delete</a></li>';
					} else {
						html += '<li><a ng-click="test()"><i class="fa fa-check text-success"></i>  Approve</a></li>';
						html += '<li><a ng-click="test()"><i class="fa fa-close text-warning"></i>  Reject</a></li>';
						if ($scope.selected.length == 1 && (privileges != undefined && privileges.CanUpdate)) {
							html += '<li><a ng-click="showForm();behaviour_edit();view_object();"><i class="fa fa-edit text-primary"></i>  Edit</a></li>';
						}
						if (privileges != undefined && privileges.CanDelete) {
							html += '<li><a ng-click="openDelete()"><i class="fa fa-trash text-danger"></i>  Delete</a></li>';
						}
					}
					$("#menuOptions").html(html);
					angular.element(document).injector().invoke(function ($compile) {
						$compile($("#context").contents())($scope);
					});
				});
			}
            return self;
        })
        .filter('groupSelectpickerOptions', GroupSelectpickerOptions)
        .config(routeConfig)
        .run(run);

    function GroupSelectpickerOptions() {
        return function (items, props) {
            var out = [];

            if (angular.isArray(items)) {
                var keys = Object.keys(props);

                items.forEach(function (item) {
                    var itemMatches = false;

                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    }

    function run(baSidebarService, $rootScope, $localStorage, config, $window, AuthenticationSvc, toastr, $sce, $filter) {
        var array_move = function (arr, old_index, new_index) {
            if (new_index >= arr.length) {
                var k = new_index - arr.length + 1;
                while (k--) {
                    arr.push(undefined);
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
            return arr; // for testing
        };
       
        // var server = 'http://119.235.252.13:3010'
        var server = 'http://103.233.109.228:3010'
        var appId = '98134469-b6ee-4720-827e-788559ee2zbv'
        $localStorage.AppId=appId;
        var getMenues=async function(Privilege,AppId){
			var Privileges = _.where(Privilege, {
				MenuAppID: AppId,
				Hidden: false
			});
			var allMenues = _.findWhere(Privileges,{AllMenues : true,MenuAppID: AppId});
			var data = [];
			Privileges.sort((a, b) => parseFloat(a.MenuSequence) - parseFloat(b.MenuSequence));
			for (let i = 0; i < Privileges.length; i++) {
				Privileges[i].title = Privileges[i].MenuLabel;
				Privileges[i].icon = Privileges[i].MenuIconUrl;
				Privileges[i].stateRef = Privileges[i].MenuMenuName;
				if(allMenues != undefined){
					Privileges[i].CanDelete = allMenues.CanDelete;
					Privileges[i].CanUpdate = allMenues.CanUpdate;
					Privileges[i].CanCreate = allMenues.CanCreate;
					Privileges[i].CanRead = allMenues.CanRead;
				}
			}
			var subMenu = function (menuId,row) {
				var menuData = _.findWhere(Privileges,{MenuId : menuId});
				var subMenues = _.where(Privileges, {
					ParentId: menuId
				});
				if(subMenues.length == 0) return null;
				var newSubMenu = [];
				for (let x = 0; x < subMenues.length; x++) {
					subMenu(subMenues[x].MenuId)
					newSubMenu.push(subMenues[x]);
				}
				menuData.subMenu = newSubMenu;
				if(row != undefined) row = menuData;
			}
			for (let i = 0; i < Privileges.length; i++) {
				if (Privileges[i].ParentMenuName == null) {
					data.push(Privileges[i]);
					subMenu(Privileges[i].MenuId,data[data.length-1]);
				}
			}
			console.log(data, 'Ini')
			var showMenu = function () {
				for (let x = 0; x < data.length; x++) {
					if (data[x].AllMenues == false) {
						baSidebarService.addStaticItem(data[x])
					}
				}
			}
			await showMenu();
			$localStorage.Menues = Privileges;
		}
        var validate = function () {
            console.log($window.location.href)
            var getauthkey = $window.location.href.split('?AuthKey=')
            if (getauthkey.length == 2) {
                var authkey = getauthkey[1].split('#/')
                $localStorage.AuthKey = authkey[0]
                $window.location.href = getauthkey[0]
                $localStorage.isLogoutSession = false

            }
            if ($localStorage.AuthKey == undefined && $localStorage.isLogoutSession == true) {
                var originurl = $window.location.href.split('#/')
                $window.location.href = server + '/login.html?origin_url=' + originurl[0] + '&app_id=' + appId + '&sessionexpired=true'

            } else if ($localStorage.AuthKey == undefined) {
                var originurl = $window.location.href.split('#/')
                $window.location.href = server + '/login.html?origin_url=' + originurl[0]+ '&app_id=' + appId 
            } else {

				var url = {
					appId: appId
				}
                AuthenticationSvc.Authentication(url).then(async function (res) {
                    if (res.data.ErrorCode == 0) {
                        await getMenues(res.data.Data.Privileges,$localStorage.AppId);
                        console.log($localStorage,"sebelum")
                        $localStorage = angular.extend($localStorage, res.data.Data)
                        // $localStorage.$reset(res.data.Data);
                        console.log($localStorage,"sesudah")
                        $rootScope.FullUserName = $localStorage.FullName;
                        $rootScope.Unit = []
                        for (var i = 0; i < $localStorage.Roles.length; i++) {
                            if (i == 0) {
                                if ($localStorage.Roles[i].UnitId == 0) {
                                    $rootScope.Unit.push({ UnitCode: $localStorage.Roles[i].UnitName, UnitId: $localStorage.Roles[i].UnitId, templateUrl: 'myPopoverTemplate.html' });
                                } else {
                                    $rootScope.Unit.push({ UnitCode: $localStorage.Roles[i].UnitCode, UnitId: $localStorage.Roles[i].UnitId, templateUrl: 'myPopoverTemplate.html' });
                                }
                            } else {
                                for (var x = 0; x < $rootScope.Unit.length; x++) {
                                    if ($rootScope.Unit[x].UnitId != $localStorage.Roles[i].UnitId) {
                                        if ($localStorage.Roles[i].UnitIdId == 0) {
                                            $rootScope.Unit.push({ UnitCode: $localStorage.Roles[i].UnitName, UnitId: $localStorage.Roles[i].UnitId, templateUrl: 'myPopoverTemplate.html' });
                                        } else {
                                            $rootScope.Unit.push({ UnitCode: $localStorage.Roles[i].UnitCode, UnitId: $localStorage.Roles[i].UnitId, templateUrl: 'myPopoverTemplate.html' });
                                        }
                                        array_move($rootScope.Unit, $rootScope.Unit.length - 1, 0)
                                        break;
                                    } else {
                                        break;
                                    }
                                }
                            }
                        }
                        $rootScope.Roles = function (id) {
                            $rootScope.isOpen = true;
                            // console.log(id.UnitId,'Id Unit');
                            $rootScope.Role = [];
                            for (var i = 0; i < $localStorage.Roles.length; i++) {
                                if (id.UnitId == $localStorage.Roles[i].UnitId) {
                                    $rootScope.Role.push({ UnitName: $localStorage.Roles[i].UnitName, RoleName: $localStorage.Roles[i].Name, Branches: $localStorage.Roles[i].Branches });
                                }
                            }
                            var html = '<div class="table-responsive">' +
                                '<table class="table table-bordered table-popover">' +
                                '<thead>' +
                                '<tr>' +
                                '<th class="sm-head">Role Name</th>' +
                                '<th class="sm-head">Branch</th>' +
                                '</tr>' +
                                '</thead>' +
                                '<tbody>';
                            for (var i = 0; i < $rootScope.Role.length; i++) {
                                html = html + '<tr> <td class="sm-body">' + $rootScope.Role[i].RoleName + '</td><td class="sm-body">';
                                for (var x = 0; x < $rootScope.Role[i].Branches.length; x++) {
                                    html = html + ($rootScope.Role[i].Branches.length - 1 == x ? $rootScope.Role[i].Branches[x].BranchName : $rootScope.Role[i].Branches[x].BranchName + ', ');
                                }
                                html = html + '</tr>';
                            }
                            html = html + '</tbody></table></div>'
                            // if(id !=undefined) angular.element('#preview').html(html);
                            return $sce.trustAsHtml(html);
                        }
                        $rootScope.isTeacher = $filter('filter')($localStorage.Roles, {'RoleId': 205 }, true)[0];
                        console.log($rootScope.isTeacher,'isi isteacher')

                    } else {
                        toastr.error('Session Expired')
                        var originurl = $window.location.href
                        $window.location.href = server + '/login.html?origin_url=' + originurl + '&app_id=' + appId + '&sessionexpired=true'
                    }
                }).catch(async (err)=>{
                    $rootScope.LoadingAuthToken = false;
                    await getMenues($localStorage.Privileges,$localStorage.AppId);
                })
            }


        }

        $rootScope.$on('$stateChangeStart', async function (event, toState, toParams, fromState, fromParams, options) {
			baSidebarService.setMenuCollapsed(false);
			await validate();
			$rootScope.privileges = _.findWhere($localStorage.Menues,{MenuAppID : $localStorage.AppId,MenuMenuName:toState.name});
			console.log($localStorage.Menues,"menues")
			console.log($rootScope.privileges,"privileges")
		});
        $rootScope.logout = function () {
            $localStorage.$reset();
            $localStorage.isLogoutSession = true
            var originurl = $window.location.href.split('#/')
            $window.location.href = server + '/login.html?origin_url=' + originurl[0] + '&app_id=' + appId + '&sessionexpired=true' 
        }
    }

    /** @ngInject */
    function routeConfig($urlRouterProvider, baSidebarServiceProvider, $stateProvider, $httpProvider) {
        $urlRouterProvider.otherwise('/dashboard');
        $httpProvider.interceptors.push(function ($q, $location, $localStorage, $window) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    var authkey = $localStorage.AuthKey
                    if (authkey) {
                        config.headers.AuthKey = authkey;
                    }
                    return config;
                },
                // 'responseError': function (response) {
                //     $localStorage.$reset();
                //     if (response.data.ErrorCode === 500 && response.data.Message === '') {
                //         // toastr.error('Session Expired')                      
                //         var originurl = $window.location.href.split('#/')
                //         $window.location.href =   'http://119.235.252.13:3010/login.html/login.html?origin_url=' + originurl[0] + '&sessionexpired=true'
                //     } 

                //     return $q.reject(response);
                // }                
            };
        });

        baSidebarServiceProvider.addStaticItem(
            {
                icon: 'ion-grid',
                title: 'Activity',
                stateRef: 'curriculum-administration'
            },
            {
                icon: 'ion-grid',
                title: 'Session Activity',
                stateRef: 'session-activity'
            },

            {
                title: 'Resource',
                icon: 'book',

                subMenu: [
                    {
                        title: 'Resource Repository',
                        stateRef: 'resource',
                    },
                    {
                        title: 'Category',
                        stateRef: 'resource-category',
                    },
                    // {
                    //     title: 'Tag',
                    //     stateRef: 'resource-tag',
                    // } 
                ]
            });
        baSidebarServiceProvider.addStaticItem({
            title: 'Online Course',
            icon: 'ion-university',

            subMenu: [
                {
                title: 'Running Online Course',
                // stateView: 'form-branchlist',
                // stateRef: 'list-branchlist'
            },
            {
                title: 'Participants',
                // stateView: 'form-branchlist',
                // stateRef: 'list-branchlist'
            },
            {
                title: 'Makeup Class Participant',
                // stateView: 'form-branchlist',
                // stateRef: 'list-branchlist'
            },
            {
                title: 'Grade',
                stateView: 'form-grading',
                stateRef: 'list-grading'
            },
            {
                title: 'Test',
                stateView: 'form-test',
                stateRef: 'list-test'
            },

            ]

        });

    }

})();

