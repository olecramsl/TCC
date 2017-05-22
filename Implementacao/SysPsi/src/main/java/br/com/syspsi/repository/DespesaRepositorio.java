package br.com.syspsi.repository;

import java.util.Calendar;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Despesa;
import br.com.syspsi.model.entity.Psicologo;

public interface DespesaRepositorio extends CrudRepository<Despesa, Long> {
	@Query("SELECT d FROM Despesa d "								
			+ "WHERE (DATE(d.vencimento) BETWEEN DATE(?1) AND DATE(?2)) "		
			+ "AND d.psicologo = ?3 ORDER BY d.vencimento ASC")
	public List<Despesa> listarPorPeriodo(Calendar dataInicial, Calendar dataFinal, Psicologo psicologo);
}
