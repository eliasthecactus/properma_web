import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Project } from '../../modules/project/project.module';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { Skill } from '../../modules/skill/skill.module';
import { ProjectRessource } from '../../modules/project-ressource/project-ressource.module';



@Component({
  selector: 'app-projectmgt',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [ApiService, AlertService],
  templateUrl: './projectmgt.component.html',
  styleUrl: './projectmgt.component.css'
})
export class ProjectmgtComponent {

  projects: Project[] = [];
  filteredProjects: Project[] = [];
  isLoading: boolean = true;

  currentProject: Partial<Project> = {};

  search = "";

  newProjectData: any = {
    name: "",
    description: ""
  }




  currentProjectRessources: ProjectRessource[] = [];

  ressourceLoading: boolean = false;

  editSkillTime: boolean = false;

  allSkills: Skill[] = [];
  searchedSkills: Skill[] = [];
  selectedSkill: Partial<Skill> = {};
  skillTime: string = "";
  skillIsLoading: boolean = false;
  skillSearchString: string = "";
  addRessourceLoading: boolean = false;



  constructor(private apiService: ApiService, public alertService: AlertService) {
    this.getProjects();
  }

  showDetails(project: Project) {
    this.currentProject = project;
    this.ressourceLoading = true;
    this.getprojectressources();

    const modal = document.getElementById('projectDetails') as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  }



  getProjects() {
    // console.log("getting users...");
    this.apiService.getprojects().subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          this.projects = response.projects;
          this.filterProjects();
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

  addProject() {
    // console.log(this.newProjectData)
    this.apiService.createproject(this.newProjectData).subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          const modal = document.getElementById('addProject') as HTMLDialogElement | null;
          if (modal) {;
            modal.close();
          }
          this.alertService.show("success", "Successfully added the project");
          this.newProjectData.name = "";
          this.newProjectData.description = "";
          this.getProjects();
        } else {
          this.alertService.show("error", response.message);
          console.log("error not null "+response)
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show("error", "There was an error while loading the projects")
      }
    );
  }

  filterProjects() {
    // console.log("filter projects");
    this.filteredProjects = this.projects.filter(project => project.name.toLowerCase().includes(this.search.toLowerCase()));
  }

  clearSearch() {
    this.search = '';
    this.filterProjects();
  }

  deleteProject() {
    this.apiService.deleteproject(this.currentProject.id!).subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          const modal = document.getElementById('projectDetails') as HTMLDialogElement | null;
          if (modal) {
            modal.close();
          }
          this.alertService.show("success", "Successfully deleted");
          this.getProjects();
        } else {
          console.log(response)
          this.alertService.show("error", response.message)

        }
      },
      (error) => {
        console.log(error);
        this.alertService.show("error", "There was an error while deleting the project")
      }
    );
  }

  calculateTotalTime(): number {
    let totalTime = 0;
    for (const resource of this.currentProjectRessources) {
        totalTime += Number(resource.time);
    }
    return totalTime;
  }

  timeConverter(type: string = "hours", value: number): Number {
    if (type == "hours") {
      return value / 3600
    } else if (type == "minutes") {
      return value / 60
    }
    // else if (type == "human") {
    //   const seconds = value % 60;
    //     const totalMinutes = Math.floor(value / 60);
    //     const minutes = totalMinutes % 60;
    //     const totalHours = Math.floor(totalMinutes / 60);
    //     const hours = totalHours % 24;
    //     const totalDays = Math.floor(totalHours / 24);
    //     const days = totalDays % 30; // Approximation of days in a month
    //     const months = Math.floor(totalDays / 30);

    //     const timeArray = [];
    //     if (months > 0) timeArray.push(`${months} month${months > 1 ? 's' : ''}`);
    //     if (days > 0) timeArray.push(`${days} day${days > 1 ? 's' : ''}`);
    //     if (hours > 0) timeArray.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    //     if (minutes > 0) timeArray.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    //     if (seconds > 0) timeArray.push(`${seconds} second${seconds > 1 ? 's' : ''}`);

    //     return timeArray.join(', ');
    // }
    else {
      return value;
    }
  }

  getprojectressources() {
    this.apiService.getprojectressources(this.currentProject.id!).subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          this.currentProjectRessources = response.project_ressources;
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
        this.ressourceLoading = false;
      }
    );
  }

  deleteprojectressource(project_ressource_id: number) {
    this.apiService.deletprojectressources(project_ressource_id).subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          this.alertService.show("success", "Successfully deleted");
          this.getprojectressources();
        } else {
          // console.log(response)
          this.alertService.show("error", response.message)
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show("error", "There was an error while deleting the project")
      }
    );
  }

  openaddressource() {
    this.skillIsLoading = true;
    const modal = document.getElementById('addProjectRessource') as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
    this.apiService.getskilltypes().subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          this.allSkills = response.skills;
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
        this.skillIsLoading = false;
      }
    );
  }

  searchSkill($event: any) {
    var searchString = $event.trim()

    if (searchString.length > 0) {

    this.searchedSkills = this.allSkills.filter(skill => skill.name.toLowerCase().includes(this.skillSearchString.toLowerCase()));
        
    // Sorting the searchedSkills alphabetically by skill name
    this.searchedSkills.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.searchedSkills = [];
    }
  }

  // swapProjectLock(state: boolean, project_id: string): void {
  //   console.log("check")
  //   const data = {lock: state}
  //   this.apiService.updateproject(data, project_id).subscribe(
  //     (response) => {
  //       // console.log(response);
  //       if (response.code == 0) {
  //         console.log(response);
  //         this.getProjects();
  //       } else {
  //         this.alertService.show('error', response.message);
  //       }
  //     },
  //     (error) => {
  //       console.log(error);
  //       this.alertService.show(
  //         'error',
  //         'There was an error while updating the project.'
  //       );
  //     }
  //   );
  // }

  addprojectressource() {
    this.addRessourceLoading = true;
    this.apiService.addprojectressources(this.currentProject.id!, this.selectedSkill.id!, (Number(this.skillTime))*3600).subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          this.allSkills = response.skills;

          const modal = document.getElementById('addProjectRessource') as HTMLDialogElement | null;
          if (modal) {
            modal.close();
          }
          this.alertService.show("success", "Successfully added ressource")
        this.selectedSkill = {};
        this.skillTime = '';
        this.skillSearchString = '';
        this.searchedSkills = [];
          this.getprojectressources();
        } else {
          this.alertService.show("error", response.message);
          console.log("error not null "+response)
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show("error", "There was an error while adding the ressource")
      },
      () => {
        this.addRessourceLoading = false;
      }
    );
  }

}
