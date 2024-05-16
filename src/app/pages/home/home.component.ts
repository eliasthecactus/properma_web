import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  faqs: {question: string, answer: string}[] = [
    {question: 'Who uses Buy Me a Coffee?', answer: 'Anyone with an audience. Youtubers, musicians, podcasters, writers, programmers, nonprofits, cosplayers, you name it. More than a million creators and their supporters are on Buy Me a Coffee.'},
    {question: 'Do I have complete ownership of my supporters?', answer: 'Yes, your supporters are strictly yours. We do not email them. You can export their list any time you like.'}    
  ];

  isMenuOpen: boolean = false;

  scrollTo(element: any): void {
    (document.getElementById(element) as HTMLElement).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.getElementById('mobilenavMenu')?.classList.toggle('-translate-x-full');
  }

}
