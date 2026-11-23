import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Menu } from '../shared/menu/menu';
import { Footer } from '../shared/footer/footer';
import { Produto } from '../model/produto';
import { ProdutoService } from '../services/produto.service';

const vazio = (): Produto => ({ nome: '', categoria: '', preco: 0, imagem: '' });

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [FormsModule, Menu, Footer],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css'
})
export class Produtos implements OnInit {
  private service = inject(ProdutoService);
  private cd = inject(ChangeDetectorRef);
  listaProdutos: Produto[] = [];
  produto = vazio();
  busca = '';
  mensagem = '';
  erroApi = '';
  erroNome = ''; erroCategoria = ''; erroPreco = ''; erroImagem = '';

  ngOnInit(): void {
    this.service.listar().subscribe({
      next: (produtos) => { this.listaProdutos = produtos; this.cd.markForCheck(); },
      error: () => this.falha('Não foi possível carregar os produtos. Verifique se a API está ligada.')
    });
  }

  get produtosFiltrados() {
    const t = this.busca.toLowerCase();
    return this.listaProdutos.filter(p => (p.nome + ' ' + p.categoria).toLowerCase().includes(t));
  }

  salvarProduto(e: Event) {
    e.preventDefault();
    if (!this.validar()) return;
    const p = this.produto;
    (p.id ? this.service.editar(p) : this.service.incluir(p)).subscribe({
      next: (salvo) => {
        this.listaProdutos = p.id
          ? this.listaProdutos.map(i => i.id === salvo.id ? salvo : i)
          : [...this.listaProdutos, salvo];
        this.msg(`Produto ${salvo.nome} ${p.id ? 'alterado' : 'cadastrado'} com sucesso.`);
        this.cancelarEdicao();
      },
      error: () => this.falha('Erro ao salvar o produto.')
    });
  }

  editarProduto(p: Produto) {
    this.cancelarEdicao();
    this.produto = { ...p };
  }

  excluirProduto(p: Produto) {
    if (!p.id || !confirm(`Deseja realmente excluir o produto "${p.nome}"?`)) return;
    this.service.excluir(p.id).subscribe({
      next: () => {
        this.listaProdutos = this.listaProdutos.filter(i => i.id !== p.id);
        if (this.produto.id === p.id) this.cancelarEdicao();
        this.msg('Produto excluído com sucesso.');
      },
      error: () => this.falha('Erro ao excluir o produto.')
    });
  }

  cancelarEdicao() {
    this.produto = vazio();
    this.erroApi = this.erroNome = this.erroCategoria = this.erroPreco = this.erroImagem = '';
  }

  private validar() {
    const p = this.produto;
    const nome = p.nome.trim().toLowerCase();
    this.erroNome = nome.length < 3 ? 'Informe um nome com pelo menos 3 letras.'
      : this.listaProdutos.some(i => i.nome.toLowerCase() === nome && i.id !== p.id) ? 'Já existe um produto com esse nome.' : '';
    this.erroCategoria = p.categoria ? '' : 'Selecione uma categoria.';
    this.erroPreco = p.preco > 0 ? '' : 'Informe um preço maior que zero.';
    this.erroImagem = p.imagem.trim() ? '' : 'Informe um emoji para o produto.';
    return !(this.erroNome || this.erroCategoria || this.erroPreco || this.erroImagem);
  }

  private falha(t: string) {
    this.erroApi = t;
    this.cd.markForCheck();
  }

  private msg(t: string) {
    this.mensagem = t;
    this.cd.markForCheck();
    setTimeout(() => { this.mensagem = ''; this.cd.markForCheck(); }, 3000);
  }
}
