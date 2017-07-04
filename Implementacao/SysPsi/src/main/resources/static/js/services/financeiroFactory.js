angular.module('syspsi').factory('financeiroFactory',['$http', 'consts', function($http, consts) {
	var _agendamento;
	var _despesa;
	var _lstDespesas;	
	var _lstReceitas;
	var _dtInicioPeriodo;
	var _dtFimPeriodo;	
	var _totalConsultasPeriodo;	
	var _totalDespesasPeriodo;
	var _totalDespesasPagasPeriodo;
	var _totalDespesasNaoPagasPeriodo;
	
	var _salvarDespesa = function(despesa) {
		var despesaDTO = {
				despesa: angular.copy(despesa),
				dataInicial: _dtInicioPeriodo,
				dataFinal: _dtFimPeriodo
		}
		
		return $http.post(consts.BASE_URL + '/salvarDespesa', despesaDTO);
	};
	
	var _excluirDespesa = function(despesa) {
		var despesaDTO = {
				despesa: angular.copy(despesa),
				dataInicial: _dtInicioPeriodo,
				dataFinal: _dtFimPeriodo
		}
		return $http.post(consts.BASE_URL + '/excluirDespesa', despesaDTO);
	};
	
	var _listarDespesasPorPeriodo = function(dataInicial, dataFinal) {		
		var params = {dataInicial: dataInicial, dataFinal: dataFinal};
		return $http.get(consts.BASE_URL + '/listarDespesasPorPeriodo', {params});
	};
	
	var _listarConsultasPorPeriodo = function(dataInicial, dataFinal) {
		var params = {dataInicial: dataInicial, dataFinal: dataFinal};
		return $http.get(consts.BASE_URL + '/listarConsultasPorPeriodo', {params});
	};
	
	var _imprimirRelatorioReceitas = function(dataInicial, dataFinal) {
		var params = {dataInicial: dataInicial, dataFinal: dataFinal};
		return $http.get(consts.BASE_URL + '/imprimirRelatorioReceitas', {params});
	};
	
	return {		
		getAgendamento: function() { return _agendamento; },
		setAgendamento: function(agendamento) { _agendamento = agendamento; },	
		getLstDespesas: function() { return _lstDespesas; },
		setLstDespesas: function(lstDespesas) { _lstDespesas = lstDespesas; },
		getLstReceitas: function() { return _lstReceitas; },
		setLstReceitas: function(lstReceitas) { _lstReceitas = lstReceitas; },
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
		getDtInicioPeriodo: function() { return _dtInicioPeriodo; },
		setDtInicioPeriodo: function(dtInicioPeriodo) { _dtInicioPeriodo = dtInicioPeriodo; },
		getDtFimPeriodo: function() { return _dtFimPeriodo; },
		setDtFimPeriodo: function(dtFimPeriodo) { _dtFimPeriodo = dtFimPeriodo; },			
		getTotalConsultasPeriodo: function() { return _totalConsultasPeriodo; },
		setTotalConsultasPeriodo: function(totalConsultasPeriodo) { _totalConsultasPeriodo = totalConsultasPeriodo; },			
		getTotalDespesasPeriodo: function() { return _totalDespesasPeriodo; },
		setTotalDespesasPeriodo: function(totalDespesasPeriodo) { _totalDespesasPeriodo = totalDespesasPeriodo; },
		getTotalDespesasPagasPeriodo: function() { return _totalDespesasPagasPeriodo; },
		setTotalDespesasPagasPeriodo: function(totalDespesasPagasPeriodo) { _totalDespesasPagasPeriodo = totalDespesasPagasPeriodo; },
		getTotalDespesasNaoPagasPeriodo: function() { return _totalDespesasNaoPagasPeriodo; },
		setTotalDespesasNaoPagasPeriodo: function(totalDespesasNaoPagasPeriodo) { _totalDespesasNaoPagasPeriodo = totalDespesasNaoPagasPeriodo; },
		salvarDespesa: _salvarDespesa,
		excluirDespesa: _excluirDespesa,
		listarDespesasPorPeriodo: _listarDespesasPorPeriodo,
		listarConsultasPorPeriodo: _listarConsultasPorPeriodo,
		imprimirRelatorioReceitas: _imprimirRelatorioReceitas
	};
}]);