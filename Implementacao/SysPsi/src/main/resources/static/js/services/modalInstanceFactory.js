angular.module('syspsi').factory('modalInstanceFactory', function() {
	var _msgErro = null;
	var _msgOk = null;
	
	return {
		setMsgErro: function(msgErro) { _msgErro = msgErro; },
		getMsgErro: function() { return _msgErro; },
		setMsgOk: function(msgOk) { _msgOk = msgOk; },
		getMsgOk: function() { return _msgOk; }
	};
});