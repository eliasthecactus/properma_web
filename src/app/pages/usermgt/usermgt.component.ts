import { Component } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  Router,
  RouterLinkActive,
  NavigationEnd,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../modules/user/user.module';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { AlertService } from '../../services/alert.service';
import { FormsModule } from '@angular/forms';
import { UserSkill } from '../../modules/user-skill/user-skill.module';
import { Skill } from '../../modules/skill/skill.module';

@Component({
  selector: 'app-usermgt',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
  ],
  providers: [ApiService, AlertService],
  templateUrl: './usermgt.component.html',
  styleUrl: './usermgt.component.css',
})
export class UsermgtComponent {
  emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  isLoading = true;
  users: User[] = [];
  filteredUsers: User[] = [];

  preRegisterUserData: any = {
    email: '',
    admin: false,
  };

  search = '';

  pendingUser: { admin: boolean; id: number; email: string }[] = [];
  showPending: boolean = false;

  currentUser: Partial<User> = {};
  currentUserSkills: UserSkill[] = [];

  skillsToAdd: Skill[] = [];
  skillTypes: Skill[] = [];
  filteredSkillTypes: Skill[] = [];
  skillSearch: string = '';

  alphabet: string[] = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode('A'.toLowerCase().charCodeAt(0) + i)
  );

  skillEdit: boolean = false;

  constructor(
    private apiService: ApiService,
    public router: Router,
    public alertService: AlertService
  ) {
    this.getUsers();
  }

  showDetails(user: User) {
    const modal = document.getElementById(
      'userDetail'
    ) as HTMLDialogElement | null;

    if (modal) {
      this.currentUser = user;
      modal.showModal();
    }
    this.getuserskill();
  }

  removePendingUser(userId: number) {
    this.apiService.deletependinguser(userId).subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          this.getUsers();
          this.alertService.show("success", "Successfully removed pending user");
        } else {
          this.alertService.show("error", response.message);
          console.log('error not null ' + response);
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

  getUsers() {
    // console.log("getting users...");
    this.apiService.getusers().subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          this.users = response.users;
          this.filterUsers();
          // this.sortTable(this.sortColumn);
        } else {
          // this.alertService.show("error", response.message);
          console.log('error not null ' + response);
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

    this.apiService.getpendinguser().subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          this.pendingUser = response.users;
          // this.sortTable(this.sortColumn);
        } else {
          // this.alertService.show("error", response.message);
          console.log('error not null ' + response);
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

  pregegister() {
    if (!this.emailPattern.test(this.preRegisterUserData.email)) {
      this.alertService.show('error', 'Invalid email address');
      return;
    }
    this.apiService.preregister(this.preRegisterUserData).subscribe(
      (response) => {
        console.log(response);

        if (response.code == 0) {
          const modal = document.getElementById(
            'addManually'
          ) as HTMLDialogElement | null;
          if (modal) {
            modal.close();
          }
          this.alertService.show('success', 'Successfully registered');
          this.preRegisterUserData.email = '';
          this.getUsers();
        } else {
          console.log(response);
          this.alertService.show('error', response.message);
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show(
          'error',
          'There was an error while registering the user'
        );
      }
    );
  }

  filterUsers() {
    // console.log("filter users");
    this.filteredUsers = this.users.filter((users) =>
      (users.first_name + ' ' + users.last_name)
        .toLowerCase()
        .includes(this.search.toLowerCase())
    );
  }

  clearSearch() {
    this.search = '';
    this.filterUsers();
  }

  deleteuser() {
    this.apiService.deleteuser(this.currentUser.id!).subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          const modal = document.getElementById(
            'userDetail'
          ) as HTMLDialogElement | null;
          if (modal) {
            modal.close();
          }
          this.alertService.show('success', 'Successfully deleted');
          this.getUsers();
        } else {
          console.log(response);
          this.alertService.show('error', response.message);
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show(
          'error',
          'There was an error while deleting the user'
        );
      }
    );
  }

  getuserskill() {
    this.apiService.getuserskills(this.currentUser.id!).subscribe(
      (response) => {
        // console.log(response);
        if (response.code == 0) {
          // console.log(response.skills)
          // this.currentUserSkills = response.skills;
          this.currentUserSkills = [];
          for (let i = 0; i < response.skills.length; i++) {
            this.currentUserSkills.push(response.skills[i]);
          }
        } else {
          console.log(response);
          this.alertService.show('error', response.message);
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show(
          'error',
          'There was an error while deleting the user'
        );
      }
    );
  }

  removeuserskill(skillId: number): void {
    // console.log("remove " + skillId)
    this.apiService.deleteuserskills(this.currentUser.id!, skillId).subscribe(
      (response) => {
        // console.log(response);
        if (response.code == 0) {
          this.alertService.show('success', 'Skill successfully removed');
          this.getuserskill();
        } else {
          console.log(response);
          this.alertService.show('error', response.message);
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show(
          'error',
          'There was an error while deleting the user'
        );
      }
    );
  }

  openassignskillmenu() {
    const modal = document.getElementById(
      'assignSkillMenu'
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
    this.apiService.getskilltypes().subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          this.skillTypes = [];
          for (let i = 0; i < response.skills.length; i++) {
            this.skillTypes.push(response.skills[i]);
          }
          this.filteredSkillTypes = this.skillTypes;
        } else {
          console.log(response);
          this.alertService.show('error', response.message);
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show(
          'error',
          'There was an error while deleting the user'
        );
      }
    );
  }

  filterAssignSkills() {
    this.filteredSkillTypes = this.skillTypes.filter((skill) =>
      (skill.name + ' ' + skill.description)
        .toLowerCase()
        .includes(this.skillSearch.toLowerCase())
    );
  }

  clearassignsearch() {
    this.skillSearch = '';
    this.filterAssignSkills();
  }

  prepareSkillToAdd(skill: Skill) {
    if (!this.skillsToAdd.includes(skill)) {
      this.skillsToAdd.push(skill);
    } else {
      const index = this.skillsToAdd.findIndex((s) => s === skill);
      this.skillsToAdd.splice(index, 1);
    }
  }

  addSkillsToUser() {
    const userId = this.currentUser.id;
    if (userId != undefined) {
      for (const skill of this.skillsToAdd) {
        this.apiService.adduserskills(userId, skill.id).subscribe(
          (response) => {
            console.log(response);
            if (response.code == 0) {
              const index = this.skillsToAdd.findIndex((s) => s === skill);
              this.skillsToAdd.splice(index, 1);
              this.alertService.show(
                'success',
                'Successfully added the skills'
              );
              this.getuserskill();
            } else {
              console.log(response);
              this.alertService.show(
                'error',
                'At least one skill already exists for this user'
              );
            }
          },
          (error) => {
            console.log(error);
            this.alertService.show(
              'error',
              'There was an error while deleting the user'
            );
          },
          () => {
            const index = this.skillsToAdd.findIndex((s) => s === skill);
            this.skillsToAdd.splice(index, 1);
          }
        );
      }

      // const modalassign = document.getElementById('assignSkillMenu') as HTMLDialogElement | null;
      // const modaldetail = document.getElementById('userDetail') as HTMLDialogElement | null;
      // if (modalassign && modaldetail) {
      //   modalassign.close();
      //   modaldetail.close();
      // }

      const modalassign = document.getElementById(
        'assignSkillMenu'
      ) as HTMLDialogElement | null;
      if (modalassign) {
        modalassign.close();
      }
    }
  }
}
