package br.com.syspsi.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Paciente;
import br.com.syspsi.model.entity.Psicologo;

public interface PacienteRepositorio extends CrudRepository<Paciente, Long> {
	public List<Paciente> findByAtivoAndPsicologoOrderByNomeCompletoAsc(boolean ativo, Psicologo psicologo);
}