angular.module('syspsi').directive('formattedTelefone', ['$filter', function($filter) {	
	return {
		require: 'ngModel', 		
		link: function(scope, element, attrs, ctrl) {
			ctrl.$formatters.push(function(data) {				
				//convert data from model format to view format				
				if (data) {
					var telefoneFormat = $filter('telefoneFormat');
					return telefoneFormat(data); //converted
				}				
			});
		}
	}
}]);