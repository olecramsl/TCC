angular.module('syspsi').factory('modal', function($http, config) {
	var _msgErro;
	var _msgConfirmacao;
	var _tipoConfirmacao;
	
	return {
		getMsgErro: function() { return _msgErro; },
		setMsgErro: function(msgErro) { _msgErro = msgErro; },
		getMsgConfirmacao: function() { return _msgConfirmacao; },
		setMsgConfirmacao: function(msgConfirmacao) { _msgConfirmacao = msgConfirmacao; },
		getTipoConfirmacao: function() { return _tipoConfirmacao; },
		setTipoConfirmacao: function(tipoConfirmacao) { _tipoConfirmacao = tipoConfirmacao; }
	};
});