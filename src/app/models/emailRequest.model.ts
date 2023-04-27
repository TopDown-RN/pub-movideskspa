export interface IEmailRequest {
  email?: string;
  codigo?: string;
  nome?: string;
}

export class EmailRequest implements IEmailRequest {
  constructor(
    public email?: string,
    public codigo?: string,
    public nome?: string
  ) {}
}
