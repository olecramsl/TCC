angular.module('syspsi', ['ui.bootstrap']);
angular.module('syspsi').controller('AgendaCtrl', function ($scope, $uibModal, $log, $document) {
  var $ctrl = this;               
  
  $ctrl.open = function (size) {	  
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'modal.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: '$ctrl',
      scope: $scope, // bind $scope to modal scope
      size: size
    });   
  };  
});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular.module('syspsi').controller('ModalInstanceCtrl', function ($uibModalInstance) {
  var $ctrl = this;        
  
  $ctrl.ok = function () {
    $uibModalInstance.close();
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});