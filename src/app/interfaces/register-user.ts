export interface RegisterUser {
  shown_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: number;
  password: string;
  confirm_password: string;
}
