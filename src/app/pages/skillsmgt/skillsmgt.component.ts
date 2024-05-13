import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { Skill } from '../../modules/skill/skill.module';
import { timeout } from 'rxjs/operators';


@Component({
  selector: 'app-skillsmgt',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [AlertService, ApiService],
  templateUrl: './skillsmgt.component.html',
  styleUrl: './skillsmgt.component.css'
})
export class SkillsmgtComponent {

  skills: Skill[] = [];
  filteredSkills: Skill[] = [];
  isLoading: boolean = true;

  currentSkill: Partial<Skill> = {};

  search = "";

  newSkillData: any = {
    name: "",
    description: ""
  }

  constructor(private apiService: ApiService, public alertService: AlertService) {
    this.getSkills();
  }

  showDetails(skill: Skill) {
    const modal = document.getElementById('skillDetail') as HTMLDialogElement | null;

    if (modal) {
      this.currentSkill = skill;
      modal.showModal();
    }
  }



  getSkills() {
    this.apiService.getskilltypes().subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          this.skills = response.skills;
          this.filterSkills();
          // this.sortTable(this.sortColumn);
        } else {
          // this.alertService.show("error", response.message);
          console.log("error not null "+response)
        }
      },
      (error) => {
        console.log(error);
        // this.alertService.show("error", "There was an error while loading the flights")
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  addSkill() {
    // console.log(this.newProjectData)
    this.apiService.createskilltype(this.newSkillData).subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          const modal = document.getElementById('addSkill') as HTMLDialogElement | null;
          if (modal) {;
            modal.close();
          }
          this.alertService.show("success", "Successfully added the skill");
          this.newSkillData.name = "";
          this.newSkillData.description = "";
          this.getSkills();
        } else {
          this.alertService.show("error", response.message);
          // console.log("error not null "+response)
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show("error", "There was an error while adding the skill")
      }
    );
  }

  filterSkills() {
    console.log("filter projects");
    this.filteredSkills = this.skills.filter(skill => skill.name.toLowerCase().includes(this.search.toLowerCase()));
  }

  clearSearch() {
    this.search = '';
    this.filterSkills();
  }

  deleteSkill() {
    this.apiService.deleteskilltype(this.currentSkill.id!).subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          const modal = document.getElementById('skillDetail') as HTMLDialogElement | null;
          if (modal) {
            modal.close();
          }
          this.alertService.show("success", "Successfully deleted");
          this.getSkills();
        } else {
          console.log(response)
          this.alertService.show("error", response.message)

        }
      },
      (error) => {
        console.log(error);
        this.alertService.show("error", "There was an error while deleting the skill")
      }
    );
  }



}
