import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { AlertService } from '../../services/alert.service';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../../modules/user/user.module';
import { FormsModule } from '@angular/forms';
import { BusinessClosure } from '../../modules/business-closure/business-closure.module';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  providers: [ThemeService, ApiService, AlertService],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  userData: Partial<User> = {};
  userDataOriginal: Partial<User> = {};

  passwordData: {
    currentpassword: string;
    newpassword: string;
    confirmnewpassword: string;
  } = { currentpassword: '', newpassword: '', confirmnewpassword: '' };

  business_hours: string = '';
  business_hours_old: string = '';

  wiggle_room: string = '';
  wiggle_room_old: string = '';

  typeSelector: string = '';
  dateSelector: string = '';

  businessclosures: BusinessClosure[] = [];
  businessclosures_types: {type: number, id: number, typename: string}[] = [];
  businessclosures_dates: { date: Date; name: string; id: number}[] = [];


  constructor(
    public themeService: ThemeService,
    private apiService: ApiService,
    public alertService: AlertService,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.getBusinessData();
    this.getCompanyClosure();
  }


  removeClosure(id: number): void {
    this.apiService.deletecompanyclosures(id).subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          this.alertService.show('success', response.message);
          this.getCompanyClosure();
        } else {
          this.alertService.show('error', response.message);
        }
      },
      (error) => {
        this.alertService.show(
          'error',
          'There was an error while deleting the closure.'
        );
      }
    );
  }

  addType(kind: string) {
    let data;

    if (kind == 'type') {
      data = { type: this.typeSelector };
    } else {
      data = { date: this.dateSelector };
    }

    this.apiService.createcompanyclosures(data).subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          this.alertService.show('success', response.message);
          this.getCompanyClosure();
        } else {
          this.alertService.show('error', response.message);
        }
      },
      (error) => {
        this.alertService.show(
          'error',
          'There was an error while updating the data.'
        );
      }
    );
  }
  
  getCompanyClosure() {
    this.apiService.getcompanyclosures().subscribe(
      (response) => {
        // console.log(response);
        if (response.code == 0) {
          console.log(response);
          this.businessclosures_dates = [];
          this.businessclosures_types = [];
          this.businessclosures = response.closures;
          for (let closure of this.businessclosures) {
            let temp = '';
            if (closure.date == undefined) {
              switch (closure.type) {
                case 0:
                  temp = 'Weekends';
                  break;
                case 1:
                  temp = 'Mondays';
                  break;
                case 2:
                  temp = 'Tuesdays';
                  break;
                case 3:
                  temp = 'Wednesdays';
                  break;
                case 4:
                  temp = 'Thursdays';
                  break;
                case 5:
                  temp = 'Fridays';
                  break;
                case 6:
                  temp = 'Saturdays';
                  break;
                case 7:
                  temp = 'Sundays';
                  break;
                case 8:
                  temp = 'Weekdays';
                  break;
                default:
                  temp = '';
                  break;
              }
              this.businessclosures_types.push({id: closure.id, type: closure.type, typename: temp});
              this.businessclosures_types.sort((a, b) => a.type - b.type);
            } else {
              this.businessclosures_dates.push({
                date: new Date(closure.date),
                name: closure.name,
                id: closure.id,
              });
            }
          }
          this.businessclosures_dates.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
        } else {
          this.alertService.show('error', response.message);
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show(
          'error',
          'There was an error while getting the closure dates.'
        );
      }
    );
  }

  getBusinessData() {
    this.apiService.getcomanydata().subscribe(
      (response) => {
        // console.log(response);
        if (response.code == 0) {
          console.log(response);
          this.business_hours = (
            Number(response.company[0].business_hours) / 60
          ).toString();
          this.business_hours_old = structuredClone(this.business_hours);
          this.wiggle_room = response.company[0].wiggle_room;
          this.wiggle_room_old = structuredClone(this.wiggle_room);
        } else {
          this.alertService.show('error', response.message);
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show(
          'error',
          'There was an error while updateing the data.'
        );
      }
    );
  }

  saveBusinessHourInformation() {
    const data = { business_hours: Number(this.business_hours) * 60 };
    this.apiService.changecompanydata(data).subscribe(
      (response) => {
        // console.log(response);
        if (response.code == 0) {
          this.business_hours_old = structuredClone(this.business_hours);
          this.alertService.show(
            'success',
            'Successfully updated business hours'
          );
        } else {
          this.alertService.show('error', response.message);
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show(
          'error',
          'There was an error while updating the business hours.'
        );
      }
    );
  }

  saveWiggleRoomInformation() {
    const data = { wiggle_room: this.wiggle_room };
    this.apiService.changecompanydata(data).subscribe(
      (response) => {
        // console.log(response);
        if (response.code == 0) {
          this.wiggle_room_old = structuredClone(this.wiggle_room);
          this.alertService.show('success', 'Successfully updated wiggle room');
        } else {
          this.alertService.show('error', response.message);
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show(
          'error',
          'There was an error while updateing the wiggle room.'
        );
      }
    );
  }

  isUserDataChanged(): boolean {
    return (
      this.userData.email !== this.userDataOriginal.email ||
      this.userData.first_name !== this.userDataOriginal.first_name ||
      this.userData.last_name !== this.userDataOriginal.last_name
    );
  }

  isPasswordOk(): boolean {
    if (
      this.passwordData.currentpassword != '' &&
      this.passwordData.newpassword.length > 7 &&
      this.passwordData.newpassword == this.passwordData.confirmnewpassword
    ) {
      return true;
    }
    return false;
  }

  changeUserData(): void {
    const data = {
      first_name: this.userData.first_name,
      last_name: this.userData.last_name,
    };
    this.apiService.changeuserdata(data).subscribe(
      (response) => {
        // console.log(response);
        if (response.code == 0) {
          const changeDataModal = document.getElementById(
            'changeUserData'
          ) as HTMLDialogElement | null;
          if (changeDataModal) {
            changeDataModal.close();
          }
          this.alertService.show('success', 'Information updated successfully');
          console.log(response);
        } else {
          this.alertService.show('error', response.message);
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show(
          'error',
          'There was an error while updateing the data.'
        );
      }
    );
  }

  updatePassword(): void {
    const data = {
      currentPassword: this.passwordData.currentpassword,
      newPassword: this.passwordData.newpassword,
    };
    this.apiService.changepassword(data).subscribe(
      (response) => {
        // console.log(response);
        if (response.code == 0) {
          const changeDataModal = document.getElementById(
            'changepasswordmodal'
          ) as HTMLDialogElement | null;
          if (changeDataModal) {
            changeDataModal.close();
          }
          this.alertService.show('success', 'Password updated successfully');
          console.log(response);
        } else {
          this.alertService.show('error', response.message);
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show(
          'error',
          'There was an error while changing the password.'
        );
      }
    );
  }

  changeData() {
    const user_id = Number(localStorage.getItem('user_id'));

    this.apiService.getusers(user_id).subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          this.userData = response.users[0];
          this.userDataOriginal = { ...this.userData };
          console.log(response);
        } else {
          this.alertService.show('error', response.message);
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show(
          'error',
          'There was an error while laoding the user details.'
        );
      }
    );

    const changeDataModal = document.getElementById(
      'changeUserData'
    ) as HTMLDialogElement | null;
    if (changeDataModal) {
      changeDataModal.showModal();
    }
  }

  logout() {
    this.cookieService.delete('token');
    this.router.navigate(['/login']);
  }
}
