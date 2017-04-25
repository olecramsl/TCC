angular.module('syspsi').service('idleService', ['$uibModal', function($uibModal) {
	this.openWarning = function (size) {	 	
		var modalInstance = $uibModal.open({
		    templateUrl: 'templates/idle_warning_modal.html',
		    windowClass: 'modal-danger',
		    controller: ['$rootScope', '$uibModalInstance', function ($rootScope, $uibModalInstance) {		    	
		    	$rootScope.$on('IdleEnd', function() {					
					$uibModalInstance.close();			
			    });
		    	
		    	$rootScope.$on('IdleTimeout', function() {					
					$uibModalInstance.close();			
			    });	
		    }],
		    size: size
		});    
	};	
}]);