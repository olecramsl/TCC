angular.module('syspsi').controller('WaitCtrl', ['$mdDialog', '$rootScope', '$scope', 'waitFactory',
	function($mdDialog,	$rootScope, $scope, waitFactory) {
	
	$scope.message = waitFactory.getMessage();
	
	$rootScope.$on("hide_wait", function (event, args) {
		$mdDialog.cancel();
    });
}]);