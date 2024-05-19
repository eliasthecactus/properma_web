import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import {HttpClientModule} from '@angular/common/http'
import { User } from '../modules/user/user.module';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // public apiUrl = 'http://127.0.0.1:5001';
  public apiUrl = 'https://properma.onrender.com';
  public uiVersion = '1.0.0-b2';
  public email = 'properma@elias.uno';

  localLogout(): void {
    localStorage.removeItem('accesshTokenExpire')
    localStorage.removeItem('refreshTokenExpire')
    localStorage.removeItem('user_id')
    this.cookieService.delete('refresh_token');
    this.cookieService.delete('token');

  }

  tokenManager(): void {
    const access_token_expire = localStorage.getItem('accesshTokenExpire')
    const refresh_token_expire = localStorage.getItem('refreshTokenExpire')

    const timestamp = Number((new Date().getTime() / 1000).toFixed(0));

    // console.log(timestamp - Number(access_token_expire))
    if (timestamp > Number(access_token_expire)) {
      if (timestamp > Number(refresh_token_expire)) {
        this.localLogout();
        this.router.navigate(['/login']);
      } else {
        this.refresh_token(this.cookieService.get('refresh_token')).subscribe(
          (response) => {
            console.log(response);
            if (response.code == 0) {
              console.log(response)
              const accessTokenDecoded = jwtDecode(response.access_token);
              localStorage.setItem('accesshTokenExpire', accessTokenDecoded['exp']!.toString());
              this.cookieService.set('token', response.access_token, undefined, '/', undefined, true, 'Lax');
              window.location.reload();

              // this.sortTable(this.sortColumn);
            } else {
              // this.alertService.show("error", response.message);
              console.log('error not null ' + response);
            }
          },
          (error) => {
            console.log(error);
            // this.alertService.show("error", "There was an error while loading the flights")
          }
        );
      }
    }


  }

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) { }


  private getHeaders(): HttpHeaders {
    this.tokenManager();
    var token = this.cookieService.get('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/user/register`, userData);
  }

  version(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/version`);
  }

  authping(): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.get(`${this.apiUrl}/api/authping`, options);
  }

  preregister(userData: any): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.post(`${this.apiUrl}/api/user/preregister`, userData, options);
  }

  login(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/user/login`, userData);
  }

  refresh_token(token: string): Observable<any> {
    const options = {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };
    return this.http.get(`${this.apiUrl}/api/user/refresh`, options);
  }

  changepassword(userData: any): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };

    return this.http.put(`${this.apiUrl}/api/user/password`, userData, options);
  }

  changeuserdata(userData: any): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };

    return this.http.put(`${this.apiUrl}/api/user`, userData, options);
  }

  contact(subject: string, message: string): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };

    const contactForm = {
      "subject": subject,
      "message": message
    }

    return this.http.post(`${this.apiUrl}/api/contact`, contactForm, options);
  }

  getusers(user_id: number = -1): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };

    var parameter = "";
    if (user_id >= 0) {
      parameter = "?id="+user_id.toString();

    }
    return this.http.get(`${this.apiUrl}/api/user`+parameter, options);
  }

  getprojects(): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.get(`${this.apiUrl}/api/project`, options);
  }

  deleteuser(userId: number): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.delete(`${this.apiUrl}/api/user/`+userId, options);
  }

  createproject(projectData: any): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.post(`${this.apiUrl}/api/project`, projectData, options);
  }

  updateproject(projectData: any, projectId: string): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.put(`${this.apiUrl}/api/project/${projectId}`, projectData, options);
  }

  deleteproject(skillId: number): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.delete(`${this.apiUrl}/api/project/`+skillId, options);
  }

  getskilltypes(): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.get(`${this.apiUrl}/api/skills`, options);
  }

  createskilltype(skillsData: any): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.post(`${this.apiUrl}/api/skills`, skillsData, options);
  }

  deleteskilltype(skillId: number): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.delete(`${this.apiUrl}/api/skills/`+skillId, options);
  }

  getuserskills(userId: number): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.get(`${this.apiUrl}/api/user/`+userId+`/skills`, options);
  }

  adduserskills(userId: number, skillId: number): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };

    const body = {
      skill_id: skillId
    }

    return this.http.post(`${this.apiUrl}/api/user/`+userId+`/skills`, body,  options);
  }

  deleteuserskills(userId: number, skillId: number): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };

    return this.http.delete(`${this.apiUrl}/api/user/`+userId+`/skills/`+skillId, options);
  }

  getprojectressources(projectId: number): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.get(`${this.apiUrl}/api/project/ressources/`+projectId, options);
  }

  addprojectressources(projectId: number, skillId: number, time: number): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };

    const body = {
      skill_id: skillId,
      project_id: projectId,
      time: time
    }

    return this.http.post(`${this.apiUrl}/api/project/ressources`, body,  options);
  }

  deletprojectressources(ressourceId: number): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };

    return this.http.delete(`${this.apiUrl}/api/project/ressources/`+ressourceId, options);
  }

  changecompanydata(data: any): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.put(`${this.apiUrl}/api/company`, data, options);
  }

  getcomanydata(): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.get(`${this.apiUrl}/api/company`, options);
  }

  getcompanyclosures(): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.get(`${this.apiUrl}/api/company/closure`, options);
  }

  createcompanyclosures(data: any): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.post(`${this.apiUrl}/api/company/closure`, data, options);
  }

  deletecompanyclosures(id: number): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.delete(`${this.apiUrl}/api/company/closure/`+id, options);
  }

  getpendinguser(): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };


    return this.http.get(`${this.apiUrl}/api/user/pending`, options);
  }

  deletependinguser(userId: number): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.delete(`${this.apiUrl}/api/user/pending/`+userId, options);
  }

  getressourceconnection(projectId: number): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.get(`${this.apiUrl}/api/project/ressources/`+projectId, options);
  }



}
