angular.module('syspsi').directive('formattedCpf', ['$filter', function($filter) {	
	return {
		require: 'ngModel', 		
		link: function(scope, element, attrs, ctrl) {
			/*
			ctrl.$parsers.push(function(data) {
				//convert data from view format to model format
				console.log("data1: " + data);
				return cpfFormat(data); //converted
			});
			*/

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