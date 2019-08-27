import { RoleI } from '@interfaces/role.interface';

export class User {
  tn: number;
  dept: number;
  fio: string;
  room: string;
  tel: string;
  email: string;
  comment: string;
  duty: string;
  status: string;
  datereg: string;
  dutyCode: number;
  fioInitials: string;
  category: number;
  idTn: number;
  login: string;
  deptKadr: number;
  ms: number;
  tnMs: number;
  adLogin: string;
  mail: string;
  surname: string;
  firstname: string;
  middlename: string;
  initialsFamily: string;
  familyWithInitials: string;
  isChief: boolean;
  roleId: number;
  role: RoleI;

  constructor(user: any = {}) {
    this.tn = user.tn;
    this.dept = user.dept;
    this.fio = user.fio;
    this.room = user.room;
    this.tel = user.tel;
    this.email = user.email;
    this.comment = user.comment;
    this.duty = user.duty;
    this.status = user.status;
    this.datereg = user.datereg;
    this.dutyCode = user.duty_code;
    this.fioInitials = user.fio_initials;
    this.category = user.category;
    this.idTn = user.id_tn;
    this.login = user.login;
    this.deptKadr = user.dept_kadr;
    this.ms = user.ms;
    this.tnMs = user.tn_ms;
    this.adLogin = user.adLogin;
    this.mail = user.mail;
    this.surname = user.surname;
    this.firstname = user.firstname;
    this.middlename = user.middlename;
    this.initialsFamily = user.initials_family;
    this.familyWithInitials = user.family_with_initials;
    this.isChief = user.is_chief;
    this.roleId = user.role_id;
    this.role = user.role;
  }

  hasRole(name: string): boolean {
    return this.role.name === name;
  }
}
