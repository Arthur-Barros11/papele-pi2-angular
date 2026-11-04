import { Component } from '@angular/core';
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
  selector: 'app-produtos',
  standalone: true,
  imports: [
    FormsModule,
    Menu,
    Footer
  ],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css'
})
export class Produtos {

  produtos: Produto[] = [];

  produto: Produto = {
    id: 0,
    nome: '',
    categoria: '',
    preco: 0,
    imagem: ''
  };

  editando = false;

  mensagem = '';

  erroNome = '';
  erroCategoria = '';
  erroPreco = '';
  erroImagem = '';

  constructor() {

    this.carregarProdutos();

  }

  carregarProdutos() {

    const salvos =
      localStorage.getItem('produtos');

    if (salvos) {

      this.produtos =
        JSON.parse(salvos);

    } else {

      this.produtos = [

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

      this.salvarProdutos();

    }

  }

  salvarProdutos() {

    localStorage.setItem(
      'produtos',
      JSON.stringify(this.produtos)
    );

  }

  salvarProduto(evento: Event) {

    evento.preventDefault();

    if (!this.validarFormulario()) {
      return;
    }

    if (this.editando) {

      const posicao =
        this.produtos.findIndex(
          item => item.id === this.produto.id
        );

      this.produtos[posicao] = {
        ...this.produto
      };

      this.mostrarMensagem(
        'Produto alterado com sucesso.'
      );

    } else {

      const novoId =
        this.produtos.length > 0
          ? Math.max(
              ...this.produtos.map(item => item.id)
            ) + 1
          : 1;

      this.produtos.push({
        ...this.produto,
        id: novoId
      });

      this.mostrarMensagem(
        'Produto cadastrado com sucesso.'
      );

    }

    this.salvarProdutos();

    this.limparFormulario();

  }

  editarProduto(produto: Produto) {

    this.produto = {
      ...produto
    };

    this.editando = true;

    this.limparErros();

  }

  excluirProduto(id: number) {

    const produto =
      this.produtos.find(item => item.id === id);

    if (!produto) {
      return;
    }

    if (
      !confirm(
        `Excluir o produto "${produto.nome}"?`
      )
    ) {

      return;

    }

    this.produtos =
      this.produtos.filter(
        item => item.id !== id
      );

    this.salvarProdutos();

    this.mostrarMensagem(
      'Produto excluído com sucesso.'
    );

  }

  cancelarEdicao() {

    this.limparFormulario();

  }

  limparFormulario() {

    this.produto = {
      id: 0,
      nome: '',
      categoria: '',
      preco: 0,
      imagem: ''
    };

    this.editando = false;

    this.limparErros();

  }

  validarFormulario(): boolean {

    this.limparErros();

    let valido = true;

    const nome =
      this.produto.nome.trim();

    const repetido =
      this.produtos.some(
        item =>
          item.nome.toLowerCase() ===
          nome.toLowerCase() &&
          item.id !== this.produto.id
      );

    if (nome.length < 3) {

      this.erroNome =
        'Informe um nome com pelo menos 3 letras.';

      valido = false;

    } else if (repetido) {

      this.erroNome =
        'Já existe um produto com esse nome.';

      valido = false;

    }

    if (!this.produto.categoria) {

      this.erroCategoria =
        'Selecione uma categoria.';

      valido = false;

    }

    if (
      !this.produto.preco ||
      this.produto.preco <= 0
    ) {

      this.erroPreco =
        'Informe um preço maior que zero.';

      valido = false;

    }

    if (!this.produto.imagem.trim()) {

      this.erroImagem =
        'Informe um emoji para o produto.';

      valido = false;

    }

    return valido;

  }

  limparErros() {

    this.erroNome = '';
    this.erroCategoria = '';
    this.erroPreco = '';
    this.erroImagem = '';

  }

  mostrarMensagem(texto: string) {

    this.mensagem = texto;

    setTimeout(() => {

      this.mensagem = '';

    }, 3000);

  }

}