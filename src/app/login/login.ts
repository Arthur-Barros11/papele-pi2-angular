import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Menu } from '../shared/menu/menu';
import { Footer } from '../shared/footer/footer';

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

  constructor(private router: Router) {}

  entrar(evento: Event) {

    evento.preventDefault();

    const emailSalvo =
      localStorage.getItem('email');

    const senhaSalva =
      localStorage.getItem('senha');

    if (
      this.email === emailSalvo &&
      this.senha === senhaSalva
    ) {

      alert('Login realizado com sucesso');

      this.router.navigate(['/']);

    } else {

      alert(
        'Login ou senha inválidos. Tente novamente!'
      );

    }

  }

}