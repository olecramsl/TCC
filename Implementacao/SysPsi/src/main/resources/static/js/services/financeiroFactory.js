angular.module('syspsi').factory('financeiroFactory',['$http', 'consts', function($http, consts) {
	var _despesa;
	var _lstDespesas;	
	var _dtInicioPeriodo;
	var _dtFimPeriodo;
	var _totalConsultasMesCorrente;	
	var _totalConsultasPeriodo;
	var _totalDespesasMesCorrente;
	var _totalDespesasPeriodo;
	var _totalDespesasPagasPeriodo;
	var _totalDespesasNaoPagasPeriodo;
	
	var _salvarDespesa = function(despesa) {		
		return $http.post(consts.BASE_URL + '/salvarDespesa', despesa);
	};
	
	var _excluirDespesa = function(despesa) {
		return $http.post(consts.BASE_URL + '/excluirDespesa', despesa);
	};
	
	var _listarDespesasPorPeriodo = function(dataInicial, dataFinal) {
		var params = {dataInicial: dataInicial, dataFinal: dataFinal};
		return $http.get(consts.BASE_URL + '/listarDespesasPorPeriodo', {params});
	};
	
	var _listarConsultasPorPeriodo = function(dataInicial, dataFinal) {
		var params = {dataInicial: dataInicial, dataFinal: dataFinal};
		return $http.get(consts.BASE_URL + '/listarConsultasPorPeriodo', {params});
	}
	
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
		getDtInicioMesCorrente: function() { return moment().startOf('month').local(); },		
		getDtFimMesCorrente: function() { return moment().endOf('month').local(); },		
		getDtInicioPeriodo: function() { return _dtInicioPeriodo; },
		setDtInicioPeriodo: function(dtInicioPeriodo) { _dtInicioPeriodo = dtInicioPeriodo; },
		getDtFimPeriodo: function() { return _dtFimPeriodo; },
		setDtFimPeriodo: function(dtFimPeriodo) { _dtFimPeriodo = dtFimPeriodo; },
		getTotalConsultasMesCorrente: function() { return _totalConsultasMesCorrente; },
		setTotalConsultasMesCorrente: function(totalConsultasMesCorrente) { _totalConsultasMesCorrente = totalConsultasMesCorrente; },		
		getTotalConsultasPeriodo: function() { return _totalConsultasPeriodo; },
		setTotalConsultasPeriodo: function(totalConsultasPeriodo) { _totalConsultasPeriodo = totalConsultasPeriodo; },
		getTotalDespesasMesCorrente: function() { return _totalDespesasMesCorrente; },
		setTotalDespesasMesCorrente: function(totalDespesasMesCorrente) { _totalDespesasMesCorrente = totalDespesasMesCorrente; },		
		getTotalDespesasPeriodo: function() { return _totalDespesasPeriodo; },
		setTotalDespesasPeriodo: function(totalDespesasPeriodo) { _totalDespesasPeriodo = totalDespesasPeriodo; },
		getTotalDespesasPagasPeriodo: function() { return _totalDespesasPagasPeriodo; },
		setTotalDespesasPagasPeriodo: function(totalDespesasPagasPeriodo) { _totalDespesasPagasPeriodo = totalDespesasPagasPeriodo; },
		getTotalDespesasNaoPagasPeriodo: function() { return _totalDespesasNaoPagasPeriodo; },
		setTotalDespesasNaoPagasPeriodo: function(totalDespesasNaoPagasPeriodo) { _totalDespesasNaoPagasPeriodo = totalDespesasNaoPagasPeriodo; },
		salvarDespesa: _salvarDespesa,
		excluirDespesa: _excluirDespesa,
		listarDespesasPorPeriodo: _listarDespesasPorPeriodo,
		listarConsultasPorPeriodo: _listarConsultasPorPeriodo
	};
}]);