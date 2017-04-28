package br.com.syspsi.model.entity;

import java.io.Serializable;
import java.util.Calendar;
import java.util.InputMismatchException;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;

@Entity
public class Paciente implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	@ManyToOne
    @JoinColumn(name="idpsicologo")
	private Psicologo psicologo;	
	@ManyToOne
    @JoinColumn(name="idgrupo")
	private GrupoPaciente grupo;
	@Column(name="nomecompleto")
	private String nomeCompleto;
	@Column(name="datanascimento")
	private Calendar dataNascimento;
	private String cpf;
	private char sexo;
	@Column(name="telefonecontato")
	private String telefoneContato;
	private String email;
	private String logradouro;
	private String numero;
	private String complemento;
	private String bairro;
	private String localidade;
	private String uf;
	private String cep;
	@Column(name="nomecompletoresponsavel")
	private String nomeCompletoResponsavel;
	@Column(name="cpfresponsavel")
	private String cpfResponsavel;
	@Column(name="telefonecontatoresponsavel")
	private String telefoneContatoResponsavel;
	private boolean ativo;
	@Transient
	private String nomeExibicao;

	// Apenas para JPA
	protected Paciente() {
		super();
	}

	public Paciente(Psicologo psicologo, String nome) {
		super();
		this.psicologo = psicologo;
		this.nomeCompleto = nome;		
	}

	/**
	 * @return the id
	 */
	public Long getId() {
		return id;
	}

	/**
	 * @param id
	 *            the id to set
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * @return the psicologo
	 */
	public Psicologo getPsicologo() {
		return psicologo;
	}

	/**
	 * @param psicologo the psicologo to set
	 */
	public void setPsicologo(Psicologo psicologo) {
		this.psicologo = psicologo;
	}

	/**
	 * @return the grupoPaciente
	 */
	public GrupoPaciente getGrupo() {
		return grupo;
	}

	/**
	 * @param grupoPaciente the grupoPaciente to set
	 */
	public void setGrupo(GrupoPaciente grupoPaciente) {
		this.grupo = grupoPaciente;
	}

	/**
	 * @return the nome
	 */
	public String getNomeCompleto() {
		return nomeCompleto;
	}

	/**
	 * @param nome
	 *            the nome to set
	 */
	public void setNomeCompleto(String nome) {
		this.nomeCompleto = nome;
	}	

	/**
	 * @return the ativo
	 */
	public boolean isAtivo() {
		return ativo;
	}

	/**
	 * @param ativo
	 *            the ativo to set
	 */
	public void setAtivo(boolean ativo) {
		this.ativo = ativo;
	}	

	/**
	 * @return the dataNascimento
	 */
	public Calendar getDataNascimento() {
		return dataNascimento;
	}	

	/**
	 * @param dataNascimento the dataNascimento to set
	 */
	public void setDataNascimento(Calendar dataNascimento) {
		this.dataNascimento = dataNascimento;
	}

	/**
	 * @return the cpf
	 */
	public String getCpf() {
		return cpf;
	}

	/**
	 * @param cpf the cpf to set	 
	 */
	public void setCpf(String cpf) {		
		this.cpf = cpf;			
	}

	/**
	 * @return the sexo
	 */
	public char getSexo() {
		return sexo;
	}

	/**
	 * @param sexo the sexo to set
	 */
	public void setSexo(char sexo) {
		this.sexo = sexo;
	}

	/**
	 * @return the telefoneContato
	 */
	public String getTelefoneContato() {
		return telefoneContato;
	}

	/**
	 * @param telefoneContato the telefoneContato to set
	 */
	public void setTelefoneContato(String telefoneContato) {
		this.telefoneContato = telefoneContato;
	}

	/**
	 * @return the email
	 */
	public String getEmail() {
		return email;
	}

	/**
	 * @param email the email to set
	 */
	public void setEmail(String email) {
		this.email = email;
	}

	/**
	 * @return the logradouro
	 */
	public String getLogradouro() {
		return logradouro;
	}

	/**
	 * @param logradouro the logradouro to set
	 */
	public void setLogradouro(String logradouro) {
		this.logradouro = logradouro;
	}

	/**
	 * @return the numero
	 */
	public String getNumero() {
		return numero;
	}

	/**
	 * @param numero the numero to set
	 */
	public void setNumero(String numero) {
		this.numero = numero;
	}

	/**
	 * @return the complemento
	 */
	public String getComplemento() {
		return complemento;
	}

	/**
	 * @param complemento the complemento to set
	 */
	public void setComplemento(String complemento) {
		this.complemento = complemento;
	}

	/**
	 * @return the bairro
	 */
	public String getBairro() {
		return bairro;
	}

	/**
	 * @param bairro the bairro to set
	 */
	public void setBairro(String bairro) {
		this.bairro = bairro;
	}

	/**
	 * @return the localidade
	 */
	public String getLocalidade() {
		return localidade;
	}

	/**
	 * @param localidade the localidade to set
	 */
	public void setLocalidade(String localidade) {
		this.localidade = localidade;
	}

	/**
	 * @return the uf
	 */
	public String getUf() {
		return uf;
	}

	/**
	 * @param uf the uf to set
	 */
	public void setUf(String uf) {
		this.uf = uf;
	}

	/**
	 * @return the cep
	 */
	public String getCep() {
		return cep;
	}

	/**
	 * @param cep the cep to set
	 */
	public void setCep(String cep) {
		this.cep = cep;
	}

	/**
	 * @return the nomeCompletoResponsavel
	 */
	public String getNomeCompletoResponsavel() {
		return nomeCompletoResponsavel;
	}

	/**
	 * @param nomeCompletoResponsavel the nomeCompletoResponsavel to set
	 */
	public void setNomeCompletoResponsavel(String nomeCompletoResponsavel) {
		this.nomeCompletoResponsavel = nomeCompletoResponsavel;
	}

	/**
	 * @return the cpfResponsavel
	 */
	public String getCpfResponsavel() {
		return cpfResponsavel;
	}

	/**
	 * @param cpfResponsavel the cpfResponsavel to set
	 */
	public void setCpfResponsavel(String cpfResponsavel) {
		this.cpfResponsavel = cpfResponsavel;
	}

	/**
	 * @return the telefoneContatoResponsavel
	 */
	public String getTelefoneContatoResponsavel() {
		return telefoneContatoResponsavel;
	}

	/**
	 * @param telefoneContatoResponsavel the telefoneContatoResponsavel to set
	 */
	public void setTelefoneContatoResponsavel(String telefoneContatoResponsavel) {
		this.telefoneContatoResponsavel = telefoneContatoResponsavel;
	}

	/**
	 * @param nomeExibicao the nomeExibicao to set
	 */
	public void setNomeExibicao(String nomeExibicao) {
		this.nomeExibicao = nomeExibicao;
	}
	
	/**
	 * @return the nomeExibicao
	 */
	public String getNomeExibicao() {
		// nome de exibicao
		if (!this.nomeCompleto.isEmpty()) {
			int index = this.nomeCompleto.split(" ").length - 1;
			if (index > 0) {
				return this.nomeCompleto.split(" ")[0] + " " + this.nomeCompleto.split(" ")[index];
			} else {
				return this.nomeCompleto.split(" ")[0];
			}
		}
		return null;
	}
	
	/**
	 * Valida o cpf informado
	 * @throws Exception caso o cpf informado seja inválido
	 */
	public void validarCPF(String cpf) throws Exception {
		String msgErro;
		if (cpf == this.cpf) {
			msgErro = "O CPF do paciente é inválido!";
		} else {
			msgErro = "O CPF do responsável é inválido!";
		}
		// considera-se erro CPF's formados por uma sequencia de numeros iguais
	    if (cpf.equals("00000000000") || cpf.equals("11111111111") ||
	    	cpf.equals("22222222222") || cpf.equals("33333333333") ||
	    	cpf.equals("44444444444") || cpf.equals("55555555555") ||
	    	cpf.equals("66666666666") || cpf.equals("77777777777") ||
	    	cpf.equals("88888888888") || cpf.equals("99999999999") ||
	       (cpf.length() != 11)) {	    	
	       throw new Exception(msgErro);
	    }

	    char dig10, dig11;
	    int sm, i, r, num, peso;

	    // "try" - protege o codigo para eventuais erros de conversao de tipo (int)
	    try {
	    	// Calculo do 1o. Digito Verificador
	    	sm = 0;
	    	peso = 10;
	    	for (i=0; i<9; i++) {              
	    		// converte o i-esimo caractere do CPF em um numero:
	    		// por exemplo, transforma o caractere '0' no inteiro 0         
	    		// (48 eh a posicao de '0' na tabela ASCII)         
	    		num = (int)(cpf.charAt(i) - 48); 
	    		sm = sm + (num * peso);
	    		peso = peso - 1;
	    	}

	    	r = 11 - (sm % 11);
	    	if ((r == 10) || (r == 11))
	    		dig10 = '0';
	    	else dig10 = (char)(r + 48); // converte no respectivo caractere numerico

	    	// Calculo do 2o. Digito Verificador
	    	sm = 0;
	    	peso = 11;
	    	for(i=0; i<10; i++) {
	    		num = (int)(cpf.charAt(i) - 48);
	    		sm = sm + (num * peso);
	    		peso = peso - 1;
	    	}

	    	r = 11 - (sm % 11);
	    	if ((r == 10) || (r == 11))
	    		dig11 = '0';
	    	else dig11 = (char)(r + 48);

	    	// Verifica se os digitos calculados conferem com os digitos informados.
	    	if ((dig10 != cpf.charAt(9)) || (dig11 != cpf.charAt(10))) {	    		
	    		throw new Exception(msgErro);
	    	}
	    } catch (InputMismatchException erro) {	    	
	    	throw new Exception(msgErro);
	    }
	}
}
