package br.com.syspsi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = {
        "br.com.syspsi.model.entity"
})
@EnableJpaRepositories(basePackages = {
        "br.com.syspsi.repository"
})
public class SysPsiApplication extends SpringBootServletInitializer {
	
	@Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(SysPsiApplication.class);
    }
	
	public static void main(String[] args) {
		SpringApplication.run(SysPsiApplication.class, args);
	}
}
