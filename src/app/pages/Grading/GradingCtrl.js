(function () {
  'use strict';
  angular
    .module('BlurAdmin.pages.Grading')
    .controller('GradingCtrl', GradingCtrl);
  /** @ngInject */
  function GradingCtrl(
    $timeout,
    $scope,
    $log,
    lia,
    $http,
    config,
    $filter,
    GradingSvc,
    $loading,
    toastr,
  ) {
    $scope.date = new Date();
    $scope.getParams = 'Id';
    $scope.data = [];
    $scope.smartState = null;
    $scope.callServer = function callServer(tableState) {
      $scope.smartState = tableState;
      $scope.isLoading = true;
      var pagination = tableState.pagination;
      if ($scope.isFilter) {
        pagination.selectPage = 1;
        $scope.isFilter = false;
      }
      var limit = pagination.number || 10; // Number of entries showed per page.
      var convert = limit - 1;
      var start = pagination.selectPage; // This is NOT the page number, but the index of item in the list that you want to use to display the table.
      GradingSvc.getlist(limit, start, tableState).then(function (res) {
        $scope.page = start;
        $scope.pageNum = pagination.selectPage - 1;
        $scope.pageSize = pagination.number;
        $scope.data = res.data.Data;
        console.log($scope.data, 'isi data')
        $scope.totalData = res.data.TotalData;
        tableState.pagination.numberOfPages = Math.ceil(
          res.data.TotalData / limit,
        ); //set the number of pages so the pagination can update
        $scope.isLoading = false;
        $timeout(function () {
          $scope.spin = false;
        }, 1000);
      });
    };
    $scope.form = {};
    $scope.refreshTable = function () {
      $scope.callServer($scope.smartState);
      $scope.spin = true;
    };
    $scope.changeFilter = function () {
      $scope.isFilter = true;
    };
    $scope.refresh = function (state) {
      if (state == 'unit') {
        $scope.spinUnit = true;
        $scope.getUnit();
      } else if (state == 'transaction') {
        $scope.spinTransaction = true;

      } else if (state == 'coa') {
        $scope.spinCoa = true;
        $scope.getCoa();
      } else if (state == 'pcc') {
        $scope.spinPCC = true;
        $scope.getPCC($scope.form.listUnit.Id, $scope.form.listBranch.Id);
      } else if (state == 'branch') {
        $scope.spinBranch = true;
        $scope.getBranch($scope.form.listUnit.Id);
      } else if (state == 'bank') {
        $scope.spinBank = true;
        $scope.getBank($scope.form.listUnit.Id, $scope.form.listBranch.Id);
      }
      else if (state == 'customer') {
        $scope.spinCustomer = true;
        $scope.getCustomer($scope.form.listUnit.Id, $scope.form.listBranch.Id);
      }
    };
    $scope.showForm = async function () {
      $scope.open('app/pages/Grading/form.html', 'xlg');
      $scope.form = {};
      $scope.popupCheckbox = []

    };
    $scope.showPopupForm = async function () {
      $scope.open('app/pages/IncomingPayment/popupForm.html', 'xlg');
      BranchCode: null
      $scope.form.listTransaction = {
        BranchId: 0,
        BranchName: null,
        Code: "INV",
        DocDate: "0001-01-01T00:00:00",
        DocNo: null,
        FinanceTransaction: true,
        Id: 1,
        Name: "Invoice",
        UnitCode: null,
        UnitId: 0,
        UnitName: null
      }
    };
    $scope.alertConfirmation = function () {
      var modal = $uibModal.open({
        animation: true,
        template: '<div class="modal-content modal-delete"> <div class="modal-body"> <p>Are you sure want to delete selected data?</p> </div> <div class="modal-footer"><button class="btn btn-default" ng-click="$close()">No</button> <button ng-click="doDelete();$close();" class="btn btn-danger">Yes</button></div> </div>',
        size: 'sm',
        scope: $scope
      });
    };
    lia.modal($scope);
    lia.behaviour($scope);
    lia.select_control($scope);
    lia.contextmenu($scope, ['edit', 'hapus'],$scope.privileges);
    $scope.getUnit = function () {


      return GradingSvc.getUnit().then(function (res) {
        if (res.data.ErrorCode == 0) {
          $scope.unit = res.data.Data;
          // $scope.form.listUnit = undefined
          $scope.form.listBranch = undefined
          $scope.form.listCustomer = undefined
          $scope.form.listBank = undefined
          $scope.form.CostProfit = undefined
          $scope.form.Details = []
        } else {
          $scope.unit = [];
        }
        $timeout(function () {
          $scope.spinUnit = false;
        }, 1000);
      });
    };
    $scope.getBranch = function (Id) {
      return GradingSvc.getBranch(Id).then(function (res) {
        $scope.spinBranch = false
        if (res.data.ErrorCode == 0) {
          $scope.branch = res.data.Data;
          // $scope.form.listBranch = undefined
          $scope.form.listCustomer = undefined
          $scope.form.listBank = undefined
          $scope.form.CostProfit = undefined
          $scope.form.Details = []
        } else {
          $scope.branch = [];
        }
      });
    };

    $scope.getRefNo = function (unitId, BranchId, BusinessPartnerId) {
      var data = { Name: 'Invoice' }
      console.log(data, 'isi ref no')
      if (data.Name == 'Invoice') {

        return GradingSvc.getInvoice(unitId, BranchId, BusinessPartnerId).then(function (res) {
          if (res.data.ErrorCode == 0) {
            $scope.popupDetails = res.data.Data;
            $scope.popupCheckbox = []

            for (var i = 0; i < $scope.popupDetails.length; i++) {
              console.log('im here i popupDetais', i)
              if (!$scope.popupCheckbox[i])
                $scope.popupCheckbox[i] = []
              for (var j = 0; j < $scope.popupDetails[i].Details.length; j++) {
                $scope.popupCheckbox[i][j] = false
                console.log('im here', j)
              }
            }
            console.log('im here isi checkbox', $scope.popupCheckbox)

          } else {
            $scope.popupDetails = [];
          }
        })

      } else if (data.Name == 'AP Invoice') {
        return GradingSvc.getApInvoice().then(function (res) {
          if (res.data.ErrorCode == 0) {
            $scope.refno = res.data.Data;
          } else {
            $scope.refno = [];
          }
          $timeout(function () {
            $scope.spinRefNo = false;
          }, 1000);
        })
      } else {
        $scope.form.listTransaction = undefined
        toastr.error('Ref. Doc. is not available')
      }
    }

    $scope.getCustomer = function (unitId, branchId) {
      return GradingSvc.getCustomer(unitId, branchId).then(function (res) {
        if (res.data.ErrorCode == 0) {
          $scope.customer = res.data.Data;
          // $scope.form.listCustomer = undefined
          $scope.form.Details = []
        } else {
          $scope.customer = [];
        }
        $timeout(function () {
          $scope.spinCustomer = false;
        }, 1000);
        console.log($scope.customer);
      });
    }
    $scope.getBank = function (unitId, branchId) {
      return GradingSvc.getBank(unitId, branchId).then(function (res) {
        if (res.data.ErrorCode == 0) {
          $scope.bank = res.data.Data;
          // $scope.form.listBank = undefined
        } else {
          $scope.bank = [];
        }
        $timeout(function () {
          $scope.spinBank = false;
        }, 1000);
        console.log($scope.bank);
      });
    }
    $scope.getPCC = function (unitId, branchId) {
      return GradingSvc.getPCC(unitId, branchId).then(function (res) {
        if (res.data.ErrorCode == 0) {
          $scope.pcc = res.data.Data;
          // $scope.form.CostProfit = undefined
        } else {
          $scope.pcc = [];
        }
        $timeout(function () {
          $scope.spinPCC = false;
        }, 1000);
        console.log($scope.pcc);
      });
    }

    $scope.getUnit();
    // $scope.getCoa();
    $scope.doSave = function () {
      $loading.start('save');
      $scope.form.UnitId = $scope.form.listUnit.Id;
      $scope.form.UnitCode = $scope.form.listUnit.Code;
      $scope.form.UnitName = $scope.form.listUnit.Name;
      $scope.form.BranchId = $scope.form.listBranch.Id;
      $scope.form.BranchCode = $scope.form.listBranch.Code;
      $scope.form.BranchName = $scope.form.listBranch.Name;
      $scope.form.BranchCode = $scope.form.listBranch.Code;
      $scope.form.BranchName = $scope.form.listBranch.Name;
      $scope.form.CustomerName = $scope.form.listCustomer.Name;
      $scope.form.CustomerId = $scope.form.listCustomer.Id;
      $scope.form.BankAccountId = $scope.form.listBank.Id;
      $scope.form.PCCId = $scope.form.CostProfit.Id;
      $scope.form.PCCCode = $scope.form.CostProfit.Code;
      $scope.form.PCCName = $scope.form.CostProfit.Name;
      $scope.form.Details = $scope.form.Details || [];
      console.log($scope.form, 'isi form')
      GradingSvc.create($scope.form).then(function (res) {
        if (res.data.ErrorCode !== 0) {
          if (res.data.ErrorCode == 1) {
            for (var i = 0; i < res.data.ValidationErrors.length; i++) {
              toastr.error(res.data.ValidationErrors[i].ErrorMessage);
            }
          } else {
            toastr.error(res.data.Message);
          }
        } else {
          toastr.success(res.data.Message);
          $scope.refreshTable();
          // $scope.behaviour_view();
          $timeout(function () {
            $scope.view_object(res.data.Data.Id);
            angular.element('#hideButton').triggerHandler('click');
          });
        }
        $loading.finish('save');
      });
    };
    $scope.view_object = async function (id) {

      if (id == undefined) id = $scope.getId;
      GradingSvc.getById(id).then(async function (res) {
        $loading.finish('save');
        if (res.data.ErrorCode !== 0) {
          toastr.error(res.data.Message);
        } else {
          $scope.form = res.data.Data;
          $scope.form.AssignmentSubmission == null ? $scope.form.Activity = 'Quiz' : $scope.form.Activity = 'Assignment'
          console.log($scope.form,'isi getlist')
        }


      });
      $loading.start('save');
    };

    $scope.doEdit = function () {
      $loading.start('save');
      var data = $scope.data;
      for (var x = 0; x < data.length; x++) {
        if (data[x].Id == $scope.form.Id) {
        }
      }

      $scope.form.UnitId = $scope.form.listUnit.Id;
      $scope.form.UnitCode = $scope.form.listUnit.Code;
      $scope.form.UnitName = $scope.form.listUnit.Name;
      $scope.form.BranchId = $scope.form.listBranch.Id;
      $scope.form.BranchCode = $scope.form.listBranch.Code;
      $scope.form.BranchName = $scope.form.listBranch.Name;
      $scope.form.BranchCode = $scope.form.listBranch.Code;
      $scope.form.BranchName = $scope.form.listBranch.Name;
      $scope.form.CustomerName = $scope.form.listCustomer.Name;
      $scope.form.CustomerId = $scope.form.listCustomer.Id;
      $scope.form.BankAccountId = $scope.form.listBank.Id;
      $scope.form.PCCId = $scope.form.CostProfit.Id;
      $scope.form.PCCCode = $scope.form.CostProfit.Code;
      $scope.form.PCCName = $scope.form.CostProfit.Name;

      $scope.form.Details = $scope.form.Details || [];
      // for (var i = 0; i < $scope.form.Details.length; i++) {
      //   $scope.form.Details[i].ChartOfAccountId = $scope.form.Details[i].ChartOfAccount.Id;
      //   $scope.form.Details[i].PCCId = $scope.form.Details[i].CostProfit.Id;
      // }
      GradingSvc.update($scope.form).then(function (res) {
        if (res.data.ErrorCode !== 0) {
          if (res.data.ErrorCode == 1) {
            for (var i = 0; i < res.data.ValidationErrors.length; i++) {
              toastr.error(res.data.ValidationErrors[i].ErrorMessage);
            }
          } else {
            toastr.error(res.data.Message);
          }
        } else {
          toastr.success(res.data.Message);
          $scope.refreshTable();
          $scope.selected = [];
          $timeout(function () {
            $scope.view_object(res.data.Data.Id);
            angular.element('#hideButton').triggerHandler('click');
          });
        }
        $loading.finish('save');
      });
    };
    $scope.doDelete = function () {
      $loading.start('save');
      var error = false;
      var i = $scope.selected.length;
      while (i--) {
        GradingSvc.delete($scope.selected[i]).then(function (res) {
          if (res.data.ErrorCode !== 0) {
            toastr.error(res.data.Message);
            error = true;
          } else {
            $scope.refreshTable();
            $scope.selected = [];
            toastr.success(res.data.Message);
          }
        });
        if (error) break;
      }
      $loading.finish('save');
      //  if (!error) toastr.success("Successfully Delete");
    };
    $scope.submit = function () {

      if ($scope.add) {
        $scope.doSave();
      } else {
        $scope.doEdit();
      }
    };
    $scope.addItem = () => {
      if ($scope.form.Details == undefined) {
        $scope.form.Details = [];
      }
      $scope.form.Details.push({
        IncomingPaymentId: $scope.add ? undefined : $scope.form.Id,
        ChartOfAccountId: '',
        ItemName: '',
        Debit: 0,
        Credit: 0,
        Remarks: '',
      });
    };
    $scope.deleteItem = function (id) {
      $scope.form.Details.splice(id, 1);
    };
    $scope.$watch('form.Details', function (a) {
      var totals = 0;
      for (var i in a) {
        var d = a[i]
        d.Total = parseFloat(d.Qty) * parseFloat(d.Price)
        totals += parseFloat(d.Total);
      }
      $scope.form.DocTotal = totals;
    }, true);
    $scope.dayDataCollapseFn = function () {
      $scope.dayDataCollapse = [];
      for (var i = 0; i < $scope.popupDetails.length; i += 1) {
        $scope.dayDataCollapse.push(false);
      }
      console.log($scope.dayDataCollapse, 'datacollapse')
    };

    $scope.tableRowExpanded = false;
    $scope.tableRowIndexExpandedCurr = "";
    $scope.tableRowIndexExpandedPrev = "";
    $scope.storeIdExpanded = "";

    $scope.selectTableRow = function (index, storeId) {
      if (typeof $scope.dayDataCollapse === 'undefined') {
        $scope.dayDataCollapseFn();
      }

      if ($scope.tableRowExpanded === false) {
        $scope.tableRowExpanded = true;
        $scope.tableRowIndexExpandedCurr = index;
        $scope.dayDataCollapse[index] = true;
      } else if ($scope.tableRowExpanded === true) {
        $scope.tableRowExpanded = false;
        $scope.tableRowIndexExpandedCurr = "";
        $scope.storeIdExpanded = "";
        $scope.dayDataCollapse[index] = false;

      }

    }
    $scope.addDetails = function () {

      for (var i = 0; i < $scope.popupDetails.length; i++) {
        for (var j = 0; j < $scope.popupDetails[i].Details.length; j++) {
          if ($scope.form.Details == undefined) {
            $scope.form.Details = []
          }
          if ($scope.popupCheckbox[i][j] == true) {

            var newVar = $scope.popupDetails[i].Details[j]
            newVar.RefDocTypeName = $scope.form.listTransaction.Name
            newVar.RefDocTypeId = $scope.form.listTransaction.Id
            newVar.RefDocId = $scope.popupDetails[i].Id
            newVar.RefDocNo = $scope.popupDetails[i].DocNo
            newVar.Unit = $scope.popupDetails[i].Details[j].UomName
            newVar.RefDocDetailId = $scope.popupDetails[i].Details[j].Id
            $scope.form.Details.push(newVar)
          }
        }
      }
      console.log($scope.form.Details)
    }

    //datepicker
    $scope.formats = ['dd-MMM-yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.popupdoa = {
      openea: false
    };

    $scope.opendoa = function () {
      $scope.popupdoa.openea = true;
    };

    $scope.popupdoa = {
      openea: false
    };

    $scope.opendoa = function () {
      $scope.popupdoa.openea = true;
    };

  }
})();
