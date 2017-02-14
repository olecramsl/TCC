/*
package br.com.syspsi;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@EnableWebSecurity
public class SecurityWebConfig extends WebSecurityConfigurerAdapter {
	private static final String USUARIO_POR_LOGIN = "SELECT login, senha, ativo, nome FROM psicologo "
            + "WHERE login = ?";
	
	private static final String PERMISSAO_POR_USUARIO = "SELECT u.login, p.nome FROM psicologo_tem_permissao up "
            + "JOIN psicologo u ON u.id = up.idPsicologo "
            + "JOIN permissao p ON p.id = up.idPermissao "
            + "WHERE u.login = ?";
	
	@Autowired
	private DataSource dataSource;		
		
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// Para qualquer requisição (anyRequest) é preciso estar 
        // autenticado (authenticated).		
		http
			.authorizeRequests()				
				.anyRequest().authenticated()
			.and()
			.formLogin()
				.loginPage("/index.html")
				// Permite acesso sem autenticação
				.permitAll();
	}
	
	@Override
	public void configure(AuthenticationManagerBuilder builder) throws Exception {		
		builder
        	.jdbcAuthentication()
        		.dataSource(dataSource)
        		.passwordEncoder(new BCryptPasswordEncoder())
        		.usersByUsernameQuery(USUARIO_POR_LOGIN)
        		//.authoritiesByUsernameQuery("SELECT ?, 'USER'") 
        		.authoritiesByUsernameQuery(PERMISSAO_POR_USUARIO)
        	.rolePrefix("ROLE_");        
	}
}
*/