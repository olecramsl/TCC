package br.com.syspsi.controller;

import java.security.Principal;
import java.util.Calendar;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.Util;
import br.com.syspsi.model.dto.InPsicologoDTO;
import br.com.syspsi.model.entity.Convenio;
import br.com.syspsi.model.entity.GrupoPaciente;
import br.com.syspsi.model.entity.Paciente;
import br.com.syspsi.model.entity.Permissao;
import br.com.syspsi.model.entity.Psicologo;
import br.com.syspsi.model.entity.PsicologoTemPermissao;
import br.com.syspsi.repository.ConvenioRepositorio;
import br.com.syspsi.repository.GrupoPacienteRepositorio;
import br.com.syspsi.repository.PacienteRepositorio;
import br.com.syspsi.repository.PermissaoRepositorio;
import br.com.syspsi.repository.PsicologoRepositorio;
import br.com.syspsi.repository.PsicologoTemPermissaoRepositorio;

@RestController
public class CadastroController {
	@Autowired
	private ConvenioRepositorio convenioRepositorio;
	
	@Autowired
	private PacienteRepositorio pacienteRepositorio;
	
	@Autowired
	private PsicologoRepositorio psicologoRepositorio;
	
	@Autowired
	private GrupoPacienteRepositorio grupoPacienteRepositorio;
	
	@Autowired
	private PsicologoTemPermissaoRepositorio psicologoTemPermissaoRepositorio;
	
	@Autowired
	private PermissaoRepositorio permissaoRepositorio;
	
	private final static Logger logger = Logger.getLogger(CadastroController.class);
	
	private static void logMessage(String msg, boolean error) {
    	if(!error && logger.isDebugEnabled()){
    	    logger.debug(msg);
    	}

    	//logs an error message with parameter
    	if (error) {
    		logger.error(msg);
    	}
    }
	
	/**
	 * @return uma lista de convênios ativos cadastrados no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/listarConveniosAtivos", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE					
			)		
	public List<Convenio> listarConveniosAtivos() {
		return this.convenioRepositorio.findByAtivo(true);
	}
	
	/**
	 * @return uma lista de convênios ativos cadastrados no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/listarConveniosInativos", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE					
			)		
	public List<Convenio> listarConveniosInativos() {
		return this.convenioRepositorio.findByAtivo(false);
	}
	
	/**
	 * @return uma lista de convênios ativos cadastrados no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/listarConvenios", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE					
			)		
	public List<Convenio> listarConvenios() {
		return (List<Convenio>) this.convenioRepositorio.findAll();
	}
	
	/**
	 * @return uma lista de convênios ativos cadastrados no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/listarGruposPacientes", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE					
			)		
	public List<GrupoPaciente> listarGruposPacientes() {
		return (List<GrupoPaciente>) this.grupoPacienteRepositorio.findAll();
	}
	
	/**
	 * Salva um paciente no BD
	 * @param paciente o paciente a ser persistido no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/salvarPaciente", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public Paciente salvarPaciente(@RequestBody Paciente paciente, Principal user) throws Exception {
		logMessage("CadastroController.salvarPaciente: cadastro do paciente " + paciente.getNomeExibicao(), false);		
		
		if (user == null) {
			logMessage("user null!", true);
			throw new Exception("Erro ao salvar o paciente: psicólogo não informado.");
		}
		
		//paciente.setPsicologo(LoginController.getPsicologoLogado());
		Psicologo psicologo = this.psicologoRepositorio.findByLogin(user.getName());
		paciente.setPsicologo(psicologo);
		if (paciente.getPsicologo() != null) {			
			if (paciente.getCpf() != null && !paciente.getCpf().trim().isEmpty()) {
				try {
					Util.validarCPF(paciente.getCpf());
				} catch(Exception ex) {
					logMessage("CPF " + paciente.getCpf() + " do paciente é inválido", true);
					throw new Exception("O CPF do paciente é inválido!");
				}
			}
			
			if (paciente.getCpfResponsavel() != null && !paciente.getCpfResponsavel().trim().isEmpty()) {
				try {
					Util.validarCPF(paciente.getCpfResponsavel());
				} catch(Exception ex) {
					logMessage("CPF " + paciente.getCpfResponsavel() + " do responsável é inválido", true);
					throw new Exception("O CPF do responsável é inválido!");
				}
			}
			
			Paciente novoPaciente = (Paciente) this.pacienteRepositorio.save(paciente);
			logMessage("CadastroController.salvarPaciente: cadastro do paciente " + novoPaciente.getNomeExibicao() + " realizado com sucesso!", false);
			
			try {
				return novoPaciente;
			} catch (DataIntegrityViolationException e) {
				if (e.getMessage().toLowerCase().contains("cpf")) {
					logMessage("salvarPaciente: CPF já cadastrado!", true);
					throw new Exception("O CPF informado já está cadastrado.");
				} else {
					logMessage("salvarPaciente: erro ao salvar o paciente: " + e.getMessage(), true);
					throw new Exception("Erro ao salvar o paciente.");
				}
			} 
		} else {
			logMessage("salvarPaciente: psicologo null!", true);
			throw new Exception("Erro ao salvar o paciente: psicólogo não informado.");
		}
	}
	
	@RequestMapping(
			value = "/listarPacientesAtivosInativos", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE			
			)
	public List<Paciente> listarPacientesAtivosInativos(@RequestParam("ativo") Boolean ativo, 
			Principal user) throws Exception {
		logMessage("CadastroController.listarPacientesAtivosInativos: início", false);
		if (user == null) {
			logMessage("user null!", true);
			throw new Exception("Erro ao listar pacientes: psicólogo não informado.");
		}
		
		Psicologo psicologo = this.psicologoRepositorio.findByLogin(user.getName());
		List<Paciente> lstPacientes = (List<Paciente>) this.pacienteRepositorio.findByAtivoAndPsicologoOrderByNomeCompletoAsc(ativo, psicologo);
		logMessage("CadastroController.listarPacientesAtivosInativos: fim", false);
		return lstPacientes;
	}
	
	@RequestMapping(
			value = "/listarPacientes", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE			
			)
	public List<Paciente> listarPacientes(Principal user) throws Exception {		
		logMessage("CadastroController.listarPacientes: início", false);
		if (user == null) {
			logMessage("user null!", true);
			throw new Exception("Erro ao listar pacientes: psicólogo não informado.");
		}
		
		Psicologo psicologo = this.psicologoRepositorio.findByLogin(user.getName());
		List<Paciente> lstPacientes = (List<Paciente>) this.pacienteRepositorio.findByPsicologoOrderByNomeCompletoAsc(psicologo);
		logMessage("CadastroController.listarPacientes: fim", false);
		return lstPacientes;
	}
	
	@RequestMapping(
			value = "/excluirPaciente", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public void excluirPaciente(@RequestBody Paciente paciente) throws Exception {
		if (paciente != null) {
			this.pacienteRepositorio.delete(paciente);			
			logMessage("Paciente id " + paciente.getId() + " e nome exibição " + paciente.getNomeExibicao() + " removido com sucesso", false);
		} else {
			logMessage("Paciente nulo", true);
			throw new Exception("Não foi possível remover o paciente");
		}
	}
	
	@RequestMapping(
			value = "/atualizarPaciente", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public void atualizarPaciente(@RequestBody Paciente paciente) throws Exception {
		this.pacienteRepositorio.save(paciente);
	}
	
	/**
	 * Salva um psicologo no BD
	 * @param psicologo o psicologo a ser persistido no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/salvarPsicologo", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public Psicologo salvarPsicologo(@RequestBody InPsicologoDTO inPsicologoDTO) throws Exception {
		logMessage("CadastroController.salvarPsicologo: cadastro do psicologo " + inPsicologoDTO.getPsicologo().getLogin(), false);
		
		Psicologo psicologo = inPsicologoDTO.getPsicologo();
		psicologo.setSenha((new BCryptPasswordEncoder().encode(inPsicologoDTO.getSenha())).getBytes());
				
		Psicologo psi = this.psicologoRepositorio.findByLogin(psicologo.getLogin());
		if (psi != null) {
			logMessage("Psicólogo já cadastrador", true);
			throw new Exception("Usuário já cadastrado!");
		}
		
		if (psicologo.getCpf() != null && !psicologo.getCpf().trim().isEmpty()) {
			try {
				Util.validarCPF(psicologo.getCpf());
			} catch(Exception ex) {
				logMessage("CPF " + psicologo.getCpf() + " do psicólogo é inválido", true);
				throw new Exception("O CPF é inválido!");
			}
		}
				
		psicologo.setChave(Util.gerarChave().getBytes());		
		psicologo.setId(this.psicologoRepositorio.getNextId());		
			
		try {
			Permissao permissao = this.permissaoRepositorio.findByNome("PSICOLOGO".toUpperCase());
			if (permissao != null) {			
				Psicologo novoPsicologo = (Psicologo) this.psicologoRepositorio.save(psicologo);
				logMessage("Cadastro do psicologo " + novoPsicologo.getLogin() + " realizado com sucesso!", false);						
				
				PsicologoTemPermissao psicologoTemPermissao = new PsicologoTemPermissao(novoPsicologo, permissao, Calendar.getInstance());
				this.psicologoTemPermissaoRepositorio.save(psicologoTemPermissao);
				
				return novoPsicologo;
			} 
			logMessage("Permissao não encontrada!", true);
			throw new Exception("Não foi possível cadastrar o psicólogo.");
		} catch (DataIntegrityViolationException e) {
			if (e.getMessage().toLowerCase().contains("cpf")) {
				logMessage("CPF já cadastrado!", true);
				throw new Exception("O CPF informado já está cadastrado.");
			} else if (e.getMessage().toLowerCase().contains("crp")) {
				logMessage("CRP já cadastrado!", true);
				throw new Exception("O CRP informado já está cadastrado.");
			} else {
				logMessage("erro ao salvar o psicologo: " + e.getMessage(), true);
				throw new Exception("Erro ao salvar o psicologo.");
			}
		} 		
	}
	
	/**
	 * Salva um convênio no BD
	 * @param paciente o paciente a ser persistido no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/salvarConvenio", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public Convenio salvarConvenio(@RequestBody Convenio convenio) throws Exception {
		logMessage("CadastroController.salvarConvenio: cadastro do convenio " + convenio.getNome(), false);
				
		if (convenio.getCnpj() != null && !convenio.getCnpj().trim().isEmpty()) {
			try {
				Util.validarCNPJ(convenio.getCnpj());
			} catch(Exception ex) {
				logMessage("CNPJ " + convenio.getCnpj() + " inválido", true);
				throw new Exception(ex.getMessage());
			}
		}
			
		try {
			convenio = (Convenio) this.convenioRepositorio.save(convenio);
			
			logMessage("cadastro do convenio " + convenio.getNome() + " realizado com sucesso!", false);				
			return convenio;
		} catch (DataIntegrityViolationException e) {
			if (e.getMessage().toLowerCase().contains("cnpj")) {
				logMessage("salvarConvenio: CNPJ já cadastrado!", true);
				throw new Exception("O CNPJ informado já está cadastrado.");
			} else {
				logMessage("salvarConvenio: erro ao salvar o Convênio: " + e.getMessage(), true);
				throw new Exception("Erro ao salvar o convênio.");
			}
		} 
	}
	
	@RequestMapping(
			value = "/atualizarConvenio", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public void atualizarConvenio(@RequestBody Convenio convenio) throws Exception {
		this.convenioRepositorio.save(convenio);
	}
	
	@RequestMapping(
			value = "/excluirConvenio", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public void excluirConvenio(@RequestBody Convenio convenio) throws Exception {
		if (convenio != null) {
			this.convenioRepositorio.delete(convenio);			
			logMessage("Convenio id " + convenio.getId() + " e nome " + convenio.getNome() + " removido com sucesso", false);
		} else {
			logMessage("Convenio nulo", true);
			throw new Exception("Não foi possível remover o convenio");
		}
	}
}
