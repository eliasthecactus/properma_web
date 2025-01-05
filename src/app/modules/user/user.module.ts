import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserSkill} from "../user-skill/user-skill.module";

export interface User {
  id: number;
  admin: boolean;
  deleted: boolean;
  email: string;
  departement: number;
  enabled: boolean;
  first_name: string;
  last_name: string;
  profile_picture: string;
  skills?: UserSkill[];
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class UserModule { }
