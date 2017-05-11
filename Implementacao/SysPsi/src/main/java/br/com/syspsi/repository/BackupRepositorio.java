package br.com.syspsi.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Backup;

public interface BackupRepositorio extends CrudRepository<Backup, Long> {	
	@Query("SELECT b FROM Backup b "
			+ "WHERE DATE(inicio) = CURDATE()")
	public Backup executouBackupHoje();
}
