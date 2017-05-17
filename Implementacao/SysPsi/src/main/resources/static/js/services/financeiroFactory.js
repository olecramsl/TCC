angular.module('syspsi').factory('financeiroFactory',['$http', 'config', function($http, config) {
	var _despesa;
	var _lstDespesas;
	
	var _salvarDespesa = function(despesa) {		
		return $http.post(config.BASE_URL + '/salvarDespesa', despesa);
	};
	
	var _excluirDespesa = function(despesa) {
		return $http.post(config.BASE_URL + '/excluirDespesa', despesa);
	};
	
	var _listarDespesasPorPeriodo = function(dataInicial, dataFinal) {
		var params = {dataInicial: dataInicial, dataFinal: dataFinal};
		return $http.get(config.BASE_URL + '/listarDespesasPorPeriodo', {params});
	};
	
	return {
		addDespesaNaLista: function(despesa) { _lstDespesas.push(despesa); },	
		getLstDespesas: function() { return _lstDespesas; },
		setLstDespesas: function(lstDespesas) { _lstDespesas = lstDespesas; },
		getDespesa: function() { return _despesa; },
		setDespesa: function(despesa) { _despesa = despesa; },
		getDespesaId: function() { return _despesa.id; },
		setDespesaId: function(id) { despesa.id = id; },
		getDespesaPsicologo: function() { return _despesa.psicologo; },
		setDespesaPsicologo: function(psicologo) { despesa.psicologo = psicologo; },
		getDespesaDescricao: function() { return _despesa.descricao; },
		setDespesaDescricao: function(descricao) { despesa.descricao = descricao; },
		getDespesaValor: function() { return _despesa.valor; },
		setDespesaValor: function(valor) { despesa.valor = valor; },
		getDespesaVencimento: function() { return _despesa.vencimento; },
		setDespesaVencimento: function(vencimento) { despesa.vencimento = vencimento; },
		getDespesaPago: function() { return _despesa.pago; },
		setDespesaPago: function(pago) { despesa.pago = pago; },
		getDespesaObservacao: function() { return _despesa.observacao; },
		setDespesaPago: function(observacao) { despesa.observacao = observacao; },
		salvarDespesa: _salvarDespesa,
		excluirDespesa: _excluirDespesa,
		listarDespesasPorPeriodo: _listarDespesasPorPeriodo
	};
}]);