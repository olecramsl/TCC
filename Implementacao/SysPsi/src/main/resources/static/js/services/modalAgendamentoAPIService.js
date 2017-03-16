angular.module('syspsi').factory('modalAgendamentoAPI', function($http, $uibModal, config) {
	var _msgErro;
	var _msgConfirmacao;
	var _tipoConfirmacao;
	
	/**
	 * Abre janela modal de erro
	 */
	var _openConfirmModal = function (size) {	 	
		var modalInstance = $uibModal.open({
			animation: true,
		    ariaLabelledBy: 'modal-title',
		    ariaDescribedBy: 'modal-body',
		    templateUrl: 'templates/confirmacaoAgendamentoModal.html',
		    controller: 'ModalAgendamentoCtrl',
		    controllerAs: 'ctrl',      
		    size: size
		});    
	};
	
	return {
		getMsgErro: function() { return _msgErro; },
		setMsgErro: function(msgErro) { _msgErro = msgErro; },
		getMsgConfirmacao: function() { return _msgConfirmacao; },
		setMsgConfirmacao: function(msgConfirmacao) { _msgConfirmacao = msgConfirmacao; },
		getTipoConfirmacao: function() { return _tipoConfirmacao; },
		setTipoConfirmacao: function(tipoConfirmacao) { _tipoConfirmacao = tipoConfirmacao; },
		openConfirmModal: _openConfirmModal
	};
});