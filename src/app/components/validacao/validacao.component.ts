import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CriptoService } from 'src/app/services/cripto.service';
import { ValidacaoService } from 'src/app/services/validacao.service';
import { DataService } from 'src/app/services/data.service';
import { IPessoa, Pessoa } from 'src/app/models/pessoa.model';

@Component({
  selector: 'app-validacao',
  templateUrl: './validacao.component.html',
  styleUrls: ['./validacao.component.scss'],
})
export class ValidacaoComponent implements OnInit, OnDestroy {
  pessoa: IPessoa = new Pessoa();

  tempoRestante: number;
  intervalo: any;
  invalido: boolean;
  expirado: boolean;
  enviado: boolean = false;
  inscricao!: Subscription;

  constructor(
    private router: Router,
    private validacaoService: ValidacaoService,
    private criptoService: CriptoService,
    private dataService: DataService
  ) {
    this.invalido = true;
    this.expirado = true;
    this.tempoRestante = 60 * 5;
  }

  ngOnInit(): void {
    this.invalido = false;
    this.expirado = false;
    this.timer();
    this.validacaoService.consultarPessoa().subscribe((resposta: any) => {
      this.pessoa = resposta;
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
    sessionStorage.clear();
    if (this.inscricao) this.inscricao.unsubscribe();
  }

  private timer() {
    this.intervalo = setInterval(() => {
      if (this.tempoRestante > 0) {
        this.tempoRestante--;
      } else {
        clearInterval(this.intervalo);
        sessionStorage.clear();
        this.expirado = true;
      }
    }, 1000);
  }

  protected voltar() {
    this.router.navigate(['/']);
  }

  protected verificarCodigo(codigo: string): void {
    let codigoGravado = sessionStorage.getItem('codigoGravado');
    const codigoCriptado = `"${this.criptoService.encriptarMD5(codigo)}"`;
    if (codigoGravado === codigoCriptado.toString() && !this.expirado) {
      this.invalido = false;
      clearInterval(this.intervalo);
      sessionStorage.clear();
      this.enviarPessoa();
    } else {
      this.invalido = true;
    }
  }

  private enviarPessoa(): void {
    this.enviado = true;
    this.inscricao = this.validacaoService.enviarPessoa(this.pessoa).subscribe({
      next: (resposta: any) => {
        const url = resposta.body.url;
        this.dataService.guardarObjeto(url);
        this.router.navigate(['/sucesso']);
        this.enviado = false;
      },
      error: (resposta: any) => {
        console.log('Erro: ', resposta);
        alert('Houve um problema com a Validação, tente novamente!');
        this.router.navigate(['/']);
        this.enviado = false;
      },
    });
  }
}
