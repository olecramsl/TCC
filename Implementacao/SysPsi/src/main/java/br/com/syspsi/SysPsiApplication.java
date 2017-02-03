package br.com.syspsi;

import java.util.Locale;
import java.util.TimeZone;

import javax.annotation.PostConstruct;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.FixedLocaleResolver;

@SpringBootApplication
@EntityScan(basePackages = {
        "br.com.syspsi.model.entity"
})
@EnableJpaRepositories(basePackages = {
        "br.com.syspsi.repository"
})
public class SysPsiApplication extends SpringBootServletInitializer {
	
	@PostConstruct
	  void started() {
	    TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
	  }
	
	@Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(SysPsiApplication.class);
    }
	
	public static void main(String[] args) {
		SpringApplication.run(SysPsiApplication.class, args);
	}
	
	@Bean
	public LocaleResolver localeResolver() {
		return new FixedLocaleResolver(new Locale("pt", "BR"));
	}
}
