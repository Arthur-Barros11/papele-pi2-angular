import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Menu } from '../shared/menu/menu';
import { Footer } from '../shared/footer/footer';
import { Cliente } from '../model/cliente';
import { ClienteService } from '../services/cliente.service';

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

  // cadastro de administrador
  souAdmin = false;
  codigoAdmin = '';
  private readonly CODIGO_ADMIN = 'PAPELE-ADMIN';

  private service = inject(ClienteService);
  private router = inject(Router);

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

    // administrador precisa informar o código correto
    if (this.souAdmin && this.codigoAdmin !== this.CODIGO_ADMIN) {

      alert('Código de administrador inválido.');

      return;
    }

    const cliente: Cliente = {

      nome: this.nome,
      email: this.email.trim().toLowerCase(),
      senha: this.senha,
      cpf: this.cpf,
      telefone: this.telefone,
      perfil: this.souAdmin ? 'admin' : 'cliente'

    };

    // 1) verifica se o e-mail já existe
    this.service.buscarPorEmail(this.email).subscribe({

      next: (existentes) => {

        if (existentes.length > 0) {
          alert('Este e-mail já está cadastrado.');
          return;
        }

        // 2) e-mail livre: inclui o cliente via API
        this.service.incluir(cliente).subscribe({

          next: () => {
            alert(
              this.souAdmin
                ? 'Administrador cadastrado com sucesso!'
                : 'Cliente cadastrado com sucesso!'
            );
            this.router.navigate(['/login']);
          },

          error: () => alert('Erro ao cadastrar o cliente.')

        });

      },

      error: () => alert(
        'Erro ao conectar com a API. Verifique se ela está rodando.'
      )

    });

  }

}