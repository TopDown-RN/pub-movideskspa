import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AutorizaService {
  private autenticado: boolean = false;
  constructor() {}

  //login
  autorizar(credencial: string) {
    if (credencial === 'autorizado') {
      this.autenticado = true;
      return true;
    }
    this.autenticado = false;
    return false;
  }

  verificarAuticacao(): boolean {
    return this.autenticado;
  }
}
