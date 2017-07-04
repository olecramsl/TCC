package br.com.syspsi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Paciente;
import br.com.syspsi.model.entity.Psicologo;

public interface PacienteRepositorio extends CrudRepository<Paciente, Long> {
	public List<Paciente> findByAtivoAndPsicologoOrderByNomeCompletoAsc(boolean ativo, Psicologo psicologo);
	public List<Paciente> findByPsicologoOrderByNomeCompletoAsc(Psicologo psicologo);
	@Query("SELECT p FROM Paciente p "
			+ "WHERE MONTH(p.dataNascimento) = MONTH(NOW()) "
			+ "AND p.psicologo = ?1 "
			+ "ORDER BY DAY(p.dataNascimento) ASC")
	public List<Paciente> listarAniversariantesDoMes(Psicologo psicologo);
}