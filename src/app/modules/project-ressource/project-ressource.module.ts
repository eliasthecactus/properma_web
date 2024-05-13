import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skill } from '../skill/skill.module';


export interface ProjectRessource {
  id: number;
  skill_id: number;
  skill_name: string;
  project_id: number;
  project_name: string;
  time: number;
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ProjectRessourceModule { }
