import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Menu } from '../shared/menu/menu';
import { Footer } from '../shared/footer/footer';

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  imagem: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    Menu,
    Footer
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  produtos: Produto[] = [
    {
      id: 1,
      nome: 'Caneta',
      categoria: 'Escrita',
      preco: 4.90,
      imagem: '🖊️'
    },
    {
      id: 2,
      nome: 'Caderno',
      categoria: 'Cadernos',
      preco: 24.90,
      imagem: '📓'
    },
    {
      id: 3,
      nome: 'Mochila',
      categoria: 'Mochilas',
      preco: 89.90,
      imagem: '🎒'
    },
    {
      id: 4,
      nome: 'Marca-texto',
      categoria: 'Escrita',
      preco: 12.90,
      imagem: '🖍️'
    },
    {
      id: 5,
      nome: 'Caderno Pontilhado',
      categoria: 'Cadernos',
      preco: 29.90,
      imagem: '📔'
    },
    {
      id: 6,
      nome: 'Mochila Escolar',
      categoria: 'Mochilas',
      preco: 99.90,
      imagem: '🎒'
    }
  ];

  produtosFiltrados = this.produtos;

  categoriaAtual = 'Todos';

  textoBusca = '';

  filtrar(categoria: string) {

    this.categoriaAtual = categoria;

    this.mostrarProdutos();

  }

  mostrarProdutos() {

    this.produtosFiltrados = this.produtos.filter(produto => {

      const categoriaOk =
        this.categoriaAtual === 'Todos' ||
        produto.categoria === this.categoriaAtual;

      const buscaOk =
        produto.nome
          .toLowerCase()
          .includes(this.textoBusca.toLowerCase());

      return categoriaOk && buscaOk;

    });

  }

  adicionarAoCarrinho(produto: Produto) {

    let carrinho =
      JSON.parse(localStorage.getItem('carrinho') || '[]');

    const existente =
      carrinho.find((item: Produto & { quantidade: number }) =>
        item.nome === produto.nome
      );

    if (existente) {

      existente.quantidade++;

    } else {

      carrinho.push({
        ...produto,
        quantidade: 1
      });

    }

    localStorage.setItem(
      'carrinho',
      JSON.stringify(carrinho)
    );

    alert('Produto adicionado ao carrinho!');

  }

}