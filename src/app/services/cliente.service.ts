import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Cliente } from '../model/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // Endereço da API (json-server)
  private readonly API = 'http://localhost:3000/clientes';

  // Injeção do cliente HTTP
  constructor(private http: HttpClient) { }

  // POST: inclui um novo cliente
  incluir(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.API, cliente);
  }

  // GET: procura clientes pelo e-mail (para não cadastrar e-mail repetido)
  buscarPorEmail(email: string): Observable<Cliente[]> {
    const params = new HttpParams().set('email', email);
    return this.http.get<Cliente[]>(this.API, { params });
  }

  // GET: login = procura cliente com o e-mail E a senha informados
  login(email: string, senha: string): Observable<Cliente | null> {
    const params = new HttpParams()
      .set('email', email)
      .set('senha', senha);

    return this.http
      .get<Cliente[]>(this.API, { params })
      .pipe(map(lista => lista[0] ?? null));
  }

}