import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Skill {
  id: number;
  name: string;
  description: string;
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class SkillModule { }
