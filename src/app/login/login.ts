import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Menu } from '../shared/menu/menu';
import { Footer } from '../shared/footer/footer';
import { ClienteService } from '../services/cliente.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    Menu,
    Footer
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  senha = '';

  private service = inject(ClienteService);
  private router = inject(Router);

  entrar(evento: Event) {

    evento.preventDefault();

    this.service.login(this.email, this.senha).subscribe({

      next: (cliente) => {

        if (cliente) {

          // guarda quem entrou (sem a senha)
          localStorage.setItem(
            'usuarioLogado',
            JSON.stringify({
              id: cliente.id,
              nome: cliente.nome,
              email: cliente.email
            })
          );

          alert('Login realizado com sucesso');

          this.router.navigate(['/']);

        } else {

          alert(
            'Login ou senha inválidos. Tente novamente!'
          );

        }

      },

      error: () => alert(
        'Erro ao conectar com a API. Verifique se ela está rodando.'
      )

    });

  }

}