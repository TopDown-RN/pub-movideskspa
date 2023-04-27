import { Component, OnInit } from '@angular/core';

import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-sucesso',
  templateUrl: './sucesso.component.html',
  styleUrls: ['./sucesso.component.scss'],
})
export class SucessoComponent implements OnInit {
  url: string = '';
  tempoRestante: number = 10;
  intervalo: any;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.url = this.dataService.receberObjeto();
    this.dataService.limparObjeto();
    this.timer();
  }

  private timer() {
    this.intervalo = setInterval(() => {
      if (this.tempoRestante > 0) {
        this.tempoRestante--;
      } else {
        this.redirecionar();
      }
    }, 1000);
  }

  private redirecionar(): void {
    window.location.href = this.url;
  }
}
