import { Component, OnInit, inject } from '@angular/core';
import { RouterLink,} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Menu } from '../shared/menu/menu';
import { Footer } from '../shared/footer/footer';
import { Produto } from '../model/produto';
import { ProdutoService } from '../services/produto.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule, Menu, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private produtoService = inject(ProdutoService);

  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  categoriaAtual = 'Todos';
  textoBusca = '';

  ngOnInit(): void {
    this.produtoService.listar().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.mostrarProdutos();
      },
      error: (erro) => console.error('Não foi possível carregar os produtos da API.', erro)
    });
  }

  filtrar(categoria: string) {
    this.categoriaAtual = categoria;
    this.mostrarProdutos();
  }

  mostrarProdutos() {
    this.produtosFiltrados = this.produtos.filter((produto) => {
      const categoriaOk = this.categoriaAtual === 'Todos' || produto.categoria === this.categoriaAtual;
      const buscaOk = produto.nome.toLowerCase().includes(this.textoBusca.toLowerCase());
      return categoriaOk && buscaOk;
    });
  }

  adicionarAoCarrinho(produto: Produto) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
    const existente = carrinho.find((item: Produto & { quantidade: number }) => item.nome === produto.nome);

    if (existente) {
      existente.quantidade++;
    } else {
      carrinho.push({ ...produto, quantidade: 1 });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert('Produto adicionado ao carrinho!');
  }
}
