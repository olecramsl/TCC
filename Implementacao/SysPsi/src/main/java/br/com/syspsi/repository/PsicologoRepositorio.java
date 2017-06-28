package br.com.syspsi.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Psicologo;

public interface PsicologoRepositorio extends CrudRepository<Psicologo, Long> {
	public Psicologo findByLogin(String login);
	@Query("SELECT COALESCE(MAX(id),0)+1 FROM Psicologo p")
	public Long getNextId();
}
