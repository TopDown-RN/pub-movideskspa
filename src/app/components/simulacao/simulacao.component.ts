import { Component, OnInit } from '@angular/core';

import { CriptoService } from 'src/app/services/cripto.service';
import { config } from 'src/app/config/config';

@Component({
  selector: 'app-simulacao',
  templateUrl: './simulacao.component.html',
})
export class SimulacaoComponent implements OnInit {
  private readonly pagina = `${config['page']}`;

  constructor(private criptoService: CriptoService) {}

  empresa: string = 'Prefeitura';
  cnpj: string = '49779054000196';
  nome: string = 'Laura Paiva';
  cpf: string = '07042121023';
  telefone: string = '(84)96969-6969';
  email: string = 'laurinha@yahoo.com.br';
  modulo: string = 'Patrimônio';
  codigo: string = '821352';
  link: string = '';

  ngOnInit(): void {}

  abrir() {
    const jason = {
      orgao: {
        cnpj: this.cnpj,
        nome: this.empresa,
      },
      usuario: {
        cpf: this.cpf,
        nome: this.nome,
        telefone: this.telefone,
        email: this.email,
      },
      sistema: {
        modulo: this.modulo,
        codigo: this.codigo,
      },
      url: '',
    };
    const json = JSON.stringify(jason);
    console.log(json);
    const cripto = this.criptoService.encriptarAES(json);
    console.log(cripto);

    this.link = `${this.pagina}?tk=${cripto}`;

    window.open(
      this.link,
      '_blank',
      'toolbar=yes, scrollbars=yes, resizable=yes, top=100, left=500, width=1000px, height=600px'
    );
    //const decripto = this.criptoService.decriptarAES(cripto);
    //console.log(decripto);
  }
}
