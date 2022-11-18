export class SendEmailDto {
  to: string;
  from: string;
  subject?: string;
  alias: string;
  templateData: any;
}
