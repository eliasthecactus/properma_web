import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UserSkill {
  id: number;
  name: string;
  description: string;
  level: number;
  skill_type_id: number
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class UserSkillModule { }
