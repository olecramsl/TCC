package br.com.syspsi.repository;

import java.util.List;
import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Paciente;

public interface PacienteRepositorio extends CrudRepository<Paciente, Long> {
	List<Paciente> findByAtivo(boolean ativo);
}