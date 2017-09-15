package br.com.syspsi.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Paciente;
import br.com.syspsi.model.entity.Psicologo;
import br.com.syspsi.model.entity.Recibo;

public interface ReciboRepositorio extends CrudRepository<Recibo, Long> {
	public List<Recibo> findByPacienteAndPsicologo(Paciente paciente, Psicologo psicologo);
}
