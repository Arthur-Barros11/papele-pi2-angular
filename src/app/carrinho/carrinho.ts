import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

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

    const total = this.total();

    const quantidade =
      this.quantidadeTotal();

    this.esvaziar();

    this.mensagem =
      `Pedido finalizado! ${quantidade} item(ns), total de R$ ${total
        .toFixed(2)
        .replace('.', ',')}. Obrigado pela compra.`;

  }

}