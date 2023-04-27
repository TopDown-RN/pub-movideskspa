export interface IOrgao {
  nome?: string;
  cnpj?: string;
}

export class Orgao implements IOrgao {
  constructor(public nome?: string, public cnpj?: string) {}
}
