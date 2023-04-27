export interface ISistema {
  modulo?: string;
  codigo?: string;
}

export class Sistema implements ISistema {
  constructor(public modulo?: string, public codigo?: string) {}
}
