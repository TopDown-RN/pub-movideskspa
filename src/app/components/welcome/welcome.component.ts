import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CriptoService } from 'src/app/services/cripto.service';
import { ValidacaoService } from 'src/app/services/validacao.service';
import { AutorizaService } from 'src/app/services/autoriza.service';
import { IPessoa, Pessoa } from 'src/app/models/pessoa.model';
import { EmailRequest, IEmailRequest } from 'src/app/models/emailRequest.model';

@Component({
  selector: 'top-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  pessoa: IPessoa = new Pessoa();
  emailFornecido: string = '';
  enviado: boolean = false;
  erroEnvio: boolean = false;
  inscricao!: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private validacaoService: ValidacaoService,
    private autorizaService: AutorizaService,
    private criptoService: CriptoService
  ) {}

  ngOnInit(): void {
    sessionStorage.clear();
    this.buscarParametros();
  }

  ngOnDestroy(): void {
    if (this.inscricao) this.inscricao.unsubscribe();
  }

  private buscarParametros() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['tk']) {
        const token = params['tk'];
        this.decriptarTokenRecebido(token);
      } else {
        this.montarObjetoPessoa(true);
      }
    });
  }

  private decriptarTokenRecebido(token: string): void {
    const descriptografado = this.criptoService.decriptarAES(token);
    const tokenObject = JSON.parse(descriptografado);
    this.montarObjetoPessoa(false, tokenObject);
  }

  private montarObjetoPessoa(padrao: boolean, objeto?: any): void {
    if (padrao) {
      this.validacaoService.consultarPessoa().subscribe((resposta: IPessoa) => {
        this.pessoa = resposta;
      });
    } else {
      this.pessoa = {
        url: objeto.url,
        dtvalidacao: '',
        sistema: {
          modulo: objeto.sistema.modulo,
          codigo: objeto.sistema.codigo,
        },
        orgao: {
          nome: objeto.orgao.nome,
          cnpj: objeto.orgao.cnpj,
        },
        usuario: {
          nome: objeto.usuario.nome,
          cpf: objeto.usuario.cpf,
          telefone: objeto.usuario.telefone,
          email: objeto.usuario.email,
        },
      };
      this.emailFornecido = objeto.usuario.email;
    }
  }

  protected clicarBto(): void {
    if (this.pessoa.usuario?.cpf !== 'CPF') {
      const autorizacao = this.autorizaService.autorizar('autorizado');
      if (autorizacao) {
        this.configurarEnvio();
      } else {
        console.log('Sem autorização para validar e-mail');
      }
    } else {
      console.log('Dados de cadastro inválidos');
    }
  }

  private configurarEnvio(): void {
    const emailEnvio = this.emailFornecido;
    this.pessoa = {
      ...this.pessoa,
      usuario: {
        ...this.pessoa.usuario,
        email: this.emailFornecido,
      },
    };

    this.validacaoService.escreverPessoa(this.pessoa);
    const codigoGerado = this.numeroAleatorio(100000, 999999).toString();
    const codigoCriptado = this.criptoService.encriptarMD5(codigoGerado);
    sessionStorage.setItem('codigoGravado', JSON.stringify(codigoCriptado));

    const request: IEmailRequest = {
      nome: this.pessoa.usuario?.nome,
      codigo: codigoGerado,
      email: emailEnvio,
    };
    this.enviarCodigo(request);
  }

  private enviarCodigo(request: EmailRequest): void {
    this.enviado = true;
    this.erroEnvio = false;

    this.inscricao = this.validacaoService
      .enviarCodigoEmail(request)
      .subscribe({
        complete: () => {
          this.router.navigate(['/validacao']);
          this.enviado = false;
        },
        error: (resposta: any) => {
          console.log('Erro: ', resposta);
          this.erroEnvio = true;
          this.enviado = false;
        },
      });
  }

  private numeroAleatorio(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}
