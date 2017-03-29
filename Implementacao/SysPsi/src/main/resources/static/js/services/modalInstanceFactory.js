angular.module('syspsi').factory('modalInstanceFactory', function() {
	var _msgErro = null;
	var _msgOk = null;
	var _msgConfirmacao;
	var _selecao;
	
	return {
		setMsgErro: function(msgErro) { _msgErro = msgErro; },
		getMsgErro: function() { return _msgErro; },
		setMsgOk: function(msgOk) { _msgOk = msgOk; },
		getMsgOk: function() { return _msgOk; },
		getMsgConfirmacao: function() { return _msgConfirmacao; },
		setMsgConfirmacao: function(msgConfirmacao) { _msgConfirmacao = msgConfirmacao; },
		getSelecao: function() { return _selecao; },
		setSelecao: function(selecao) { _selecao = selecao; }
	};
});