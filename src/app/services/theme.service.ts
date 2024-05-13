import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(private cookieService: CookieService) { }

  changeTheme(theme: string) {
    console.log("check")
    this.cookieService.set('theme', theme, undefined, "/")
    document.documentElement.setAttribute("data-theme", theme)
  }

  setSavedTheme() {
    document.documentElement.setAttribute("data-theme",this.cookieService.get('theme'))
  }
}
