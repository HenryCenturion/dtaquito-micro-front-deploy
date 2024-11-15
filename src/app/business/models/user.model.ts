export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  roleType: string;
  token: string;

  constructor(id: number, name: string, email: string, password: string, roleType: string, token: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.roleType = roleType;
    this.token = token;
  }
}
