export interface IUsuario {
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
}

export class Usuario implements IUsuario {
  constructor(
    public nome?: string,
    public cpf?: string,
    public email?: string,
    public telefone?: string
  ) {}
}
