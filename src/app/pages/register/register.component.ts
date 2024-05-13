import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  providers: [ApiService, AlertService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  isLoading: boolean = false;


  registerData = {
    token: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: '',
  }



  constructor(public alertService: AlertService, private apiService: ApiService, private activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    this.activatedRoute.queryParams
    .subscribe(params => {
      if (params['token'] && params['email']) {
        this.registerData.token = params['token'];
        this.registerData.email = params['email'];
      } else {
        console.log("some parameters are missing");
      }
    }
  );
  }


  register() {
    if (this.registerData.password !== this.registerData.confirm_password) {
      this.alertService.show("error", "Passwords does not match");
      return;
    }
    this.isLoading = true;
    this.apiService.register(this.registerData).subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          this.router.navigate(['/login'])
          this.alertService.show("success", "Successfully registered. Please login now...");
        } else {
          this.isLoading = false;
          this.alertService.show("error", response.message);
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show("error", "There was an error while registering. Please contact the administrator.")
      }
    );
  }

}
