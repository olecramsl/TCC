angular.module('syspsi').directive('formattedDataNascimento', ['$filter', function($filter) {	
	return {
		require: 'ngModel', 		
		link: function(scope, element, attrs, ctrl) {
			ctrl.$formatters.push(function(data) {				
				//convert data from model format to view format				
				if (data) {
					var dateFormat = $filter('date');
					return dateFormat(data, 'dd/MM/yyyy'); //converted
				}				
			});
		}
	}
}]);