import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, map} from 'rxjs';
import {Pedido}     from '../carrinho/pedido';


@Injectable({
    providedIn: 'root'
})
export class PedidoService {
    constructor(private http: HttpClient){}
    //cria o metodo para registrar o pedido feito, que apos o pedido o Obsevable contendo o pedido feito e apos isso faz o post para cadastrar o pedido
        registrarPedido(pedido: Pedido): Observable<Pedido> {
            return this.http.post<Pedido>(this.API, pedido);
        }
    //esse metodo consulta os pedidos  feitos e usa [] para fazer uma lista de todos os pedidos feitos    
        listarPedidos(): Observable<Pedido[]>{
            return this.http.get<Pedido[]>(this.API);
        }
    //já esse filtra todos os pedidos feitos por id do cliente
        buscarPedidosPorCliente(clienteId: string): Observable<Pedido[]> {
          return this.http.get<Pedido[]>(this.API).pipe(
            map(pedidos =>
              pedidos.filter(pedido =>
               String(pedido.clienteId) === String(clienteId)
      )
    )
  );
}

    
    private readonly API = 'http://localhost:3000/pedidos';
}