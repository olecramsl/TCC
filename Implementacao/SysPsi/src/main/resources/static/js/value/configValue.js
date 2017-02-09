angular.module("syspsi").value("config", {
	baseUrl: "http://localhost:8080",
	tiposConfirmacoes: {
		'REMOVER_EVENTOS_FUTUROS': 1,
		'MOVER_EVENTOS': 2,
		'ALTERAR_DADOS_FUTUROS': 3,
		'REMOVER_EVENTO': 4,
		'REMOVER_EVENTOS_GRUPO': 5
	}
});