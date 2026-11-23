import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import {PedidoService} from '../services/pedido.service';

import { Menu } from '../shared/menu/menu';
import { Footer } from '../shared/footer/footer';

interface ItemCarrinho {

  id: number;
  nome: string;
  categoria: string;
  preco: number;
  imagem: string;
  quantidade: number;

}

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [
    RouterLink,
    Menu,
    Footer
  ],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class Carrinho {
  private pedidoService = inject(PedidoService);
  private router = inject(Router);

  usuarioLogado: any = null;

  itens: ItemCarrinho[] = [];

  mensagem = '';

  constructor() {

    this.carregar();

  }

  carregar() {

    const salvo =
      localStorage.getItem('carrinho');

    this.itens =
      salvo
        ? JSON.parse(salvo)
        : [];

  }

  verificarLogin() : boolean {
    const usuario = localStorage.getItem('usuarioLogado');

    if(!usuario){
      return false;
    }
    this.usuarioLogado = JSON.parse(usuario);
    return true;
  }

  salvar() {

    localStorage.setItem(
      'carrinho',
      JSON.stringify(this.itens)
    );

  }

  adicionarExemplos() {

    this.adicionar({
      id: 1,
      nome: 'Caneta',
      categoria: 'Escrita',
      preco: 4.90,
      imagem: '🖊️'
    });

    this.adicionar({
      id: 2,
      nome: 'Caderno',
      categoria: 'Cadernos',
      preco: 24.90,
      imagem: '📓'
    });

    this.adicionar({
      id: 3,
      nome: 'Mochila',
      categoria: 'Mochilas',
      preco: 89.90,
      imagem: '🎒'
    });

  }

  adicionar(produto: any) {

    const existente =
      this.itens.find(
        item => item.nome === produto.nome
      );

    if (existente) {

      existente.quantidade++;

    } else {

      this.itens.push({
        ...produto,
        quantidade: 1
      });

    }

    this.salvar();

  }

  alterarQuantidade(
    nome: string,
    delta: number
  ) {

    const item =
      this.itens.find(
        item => item.nome === nome
      );

    if (!item) {
      return;
    }

    item.quantidade += delta;

    if (item.quantidade <= 0) {

      this.remover(nome);

    } else {

      this.salvar();

    }

  }

  remover(nome: string) {

    this.itens =
      this.itens.filter(
        item => item.nome !== nome
      );

    this.salvar();

  }

  total(): number {

    return this.itens.reduce(
      (soma, item) =>
        soma + item.preco * item.quantidade,
      0
    );

  }

  quantidadeTotal(): number {

    return this.itens.reduce(
      (soma, item) =>
        soma + item.quantidade,
      0
    );

  }

  esvaziar() {

    this.itens = [];

    this.salvar();

  }

  finalizar() {

    if (!this.verificarLogin()) {
    alert('Você precisa fazer login para finalizar o pedido.');
    this.router.navigate(['/login']);
    return;
  }

  const pedido = {
    clienteId: String (this.usuarioLogado.id),
    clienteNome: this.usuarioLogado.nome,
    itens: [...this.itens],
    total: this.total(),
    data: new Date().toISOString(),
    status: 'pendente'
  };

  this.pedidoService.registrarPedido(pedido).subscribe({
    next: (resposta) => {
      alert('pedido realizado com sucesso!');
      
      this.esvaziar();

      this.mensagem = 'Obrigado pela compra!!';

    },

    error: () => {
      alert('erro ao registrar o pedido. Tente novamente.');
    }
  })

  }

}