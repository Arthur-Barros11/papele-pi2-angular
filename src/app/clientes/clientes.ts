import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Menu } from '../shared/menu/menu';
import { Footer } from '../shared/footer/footer';

interface Cliente {

  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;

}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    FormsModule,
    Menu,
    Footer
  ],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes {

  nome = '';
  email = '';
  senha = '';
  cpf = '';
  telefone = '';

  constructor(private router: Router) {}

  cadastrar(evento: Event) {

    evento.preventDefault();

    if (
      !this.nome ||
      !this.email ||
      !this.senha ||
      !this.cpf ||
      !this.telefone
    ) {

      alert(
        'Todos os dados devem ser preenchidos para o cadastro'
      );

      return;
    }

    const cliente: Cliente = {

      nome: this.nome,
      email: this.email,
      senha: this.senha,
      cpf: this.cpf,
      telefone: this.telefone

    };

    const listaClientes: Cliente[] = [];

    listaClientes.push(cliente);

    localStorage.setItem(
      'email',
      this.email
    );

    localStorage.setItem(
      'senha',
      this.senha
    );

    localStorage.setItem(
      'cliente',
      JSON.stringify(listaClientes)
    );

    alert(
      'Cliente cadastrado com sucesso!'
    );

    this.router.navigate(['/login']);

  }

}