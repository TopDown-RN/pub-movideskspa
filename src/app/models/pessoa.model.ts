import { IOrgao } from './orgao.model';
import { IUsuario } from './usuario.model';
import { ISistema } from './sistema.model';

export interface IPessoa {
  usuario?: IUsuario;
  orgao?: IOrgao;
  sistema?: ISistema;
  url?: string;
  dtvalidacao?: string;
}

export class Pessoa implements IPessoa {
  constructor(
    public usuario?: IUsuario,
    public orgao?: IOrgao,
    public sistema?: ISistema,
    public url?: string,
    public dtvalidacao?: string
  ) {}
}
