angular.module('syspsi').directive('formattedCpf', ['$filter', function($filter) {	
	return {
		require: 'ngModel', 		
		link: function(scope, element, attrs, ctrl) {			
			ctrl.$formatters.push(function(data) {				
				//convert data from model format to view format				
				if (data) {
					var cpfFormat = $filter('cpfFormat');
					return cpfFormat(data); //converted
				}				
			});
		}
	}
}]);