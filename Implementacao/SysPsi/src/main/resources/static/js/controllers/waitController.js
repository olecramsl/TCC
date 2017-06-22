angular.module('syspsi').controller('WaitCtrl', ['$mdDialog', '$rootScope', '$scope', 'utilService',
	function($mdDialog,	$rootScope, $scope, utilService) {
	
	$scope.message = utilService.getMessage();
	
	$rootScope.$on("hide_wait", function (event, args) {
		$mdDialog.cancel();
    });
}]);