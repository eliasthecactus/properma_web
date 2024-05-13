import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './login.component.html',
  providers: [ApiService, CookieService, AlertService],
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isLoading = false;

  constructor(private apiService: ApiService, private cookieService: CookieService, private router: Router, public alertService: AlertService) {

  }

  userData: any = {
    email: '',
    password: ''
  };


  login() {
    this.isLoading = true;
    this.apiService.login(this.userData).subscribe(
      (response) => {
        console.log(response);

        if (response.code == 0) {
          // this.cookieService.set('token', response.access_token);
          this.cookieService.set('token', response.access_token, undefined, '/', undefined, true, 'Lax');
          this.cookieService.set('refresh_token', response.refresh_token, undefined, '/', undefined, true, 'Lax');
          const accessTokenDecoded = jwtDecode(response.access_token)
          const refreshTokenDecoded = jwtDecode(response.refresh_token)
          localStorage.setItem('accesshTokenExpire', accessTokenDecoded['exp']!.toString())
          localStorage.setItem('refreshTokenExpire', refreshTokenDecoded['exp']!.toString())
          localStorage.setItem('user_id',response.user)
          this.router.navigate(['/cockpit']);
          this.isLoading = false;
        } else {
          this.alertService.show("error", response.message);
          this.isLoading = false;
        }
      },
      (error) => {
        this.alertService.show("error", "There was an error. Please contact your administrator.");
        this.isLoading = false;
        console.log(error);
      }
    );
  }

}
