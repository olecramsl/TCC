angular.module('syspsi').factory('waitFactory',[function() {
	var _message;
	
	return {
		getMessage: function() { return _message; },
		setMessage: function(message) { _message = message; }
	}
}]);