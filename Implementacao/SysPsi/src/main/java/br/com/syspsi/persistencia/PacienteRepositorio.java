package br.com.syspsi.persistencia;

import br.com.syspsi.modelo.Paciente;

import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface PacienteRepositorio extends CrudRepository<Paciente, Long> {
	List<Paciente> findByAtivo(boolean ativo);
}