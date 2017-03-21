angular.module('syspsi').directive('formattedCep', ['$filter', function($filter) {	
	return {
		require: 'ngModel', 		
		link: function(scope, element, attrs, ctrl) {
			ctrl.$formatters.push(function(data) {				
				//convert data from model format to view format				
				if (data) {
					var cepFormat = $filter('cepFormat');
					return cepFormat(data); //converted
				}				
			});
		}
	}
}]);