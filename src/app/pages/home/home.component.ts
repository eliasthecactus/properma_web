import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, HttpClientModule],
  templateUrl: './home.component.html',
  providers: [ApiService],
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(public apiService: ApiService) {

  }

  faqs: {question: string, answer: string}[] = [
    {question: 'Who can use this project management platform?', answer: 'Our platform is designed for teams of all sizes, including freelancers, startups, and large enterprises. Anyone looking to efficiently manage projects and distribute tasks can benefit from it.'},
    {question: 'How do I add users to my projects?', answer: 'You can add users to your projects by navigating to the project settings and selecting the "Add Users" option. From there, you can invite team members via email or assign them directly if they are already part of your organization.'},
    {question: 'What types of skills can be added?', answer: 'You can add a wide range of skills that are relevant to your projects. This includes technical skills, soft skills, and any other expertise that your team members possess. This helps in matching the right people to the right tasks.'},
    {question: 'Can I track the progress of my projects?', answer: 'Yes, our platform provides comprehensive tracking features. You can view progress updates, timelines, and milestones to ensure that your projects stay on track and deadlines are met.'},
    {question: 'Is there a way to get an overview of all ongoing projects?', answer: 'Absolutely. Our dashboard gives you a bird’s-eye view of all ongoing projects, including their status, key metrics, and any pending tasks. This helps in keeping everything organized and making informed decisions.'},
    {question: 'How do I distribute tasks among team members?', answer: 'Tasks can be distributed by creating them within a project and assigning them to team members based on their skills and availability. You can also set priorities and deadlines to ensure efficient task management.'},
    {question: 'What kind of reports can I generate?', answer: 'Our platform allows you to generate various reports such as project progress reports, time tracking, task completion status, and resource utilization. These reports help in analyzing performance and making data-driven decisions.'},
    {question: 'Is there a mobile app available?', answer: 'Yes, our platform is accessible via a mobile app, allowing you to manage your projects and stay connected with your team while on the go. The app is available for both iOS and Android devices.'},
    {question: 'How secure is my data?', answer: 'We take data security very seriously. Our platform uses advanced encryption and security protocols to ensure that your data is safe and secure at all times.'},
    {question: 'Can I customize the platform to suit my needs?', answer: 'Yes, our platform offers various customization options. You can tailor the interface, project workflows, and other settings to fit your specific requirements and enhance your team’s productivity.'},
    {question: 'What does Properma stand for?', answer: 'Project-Person-Management.'}
    ];

    plans = 
    {
      types: [
        {title: 'Startup', price: '4'},
        {title: 'Fortune', price: '7'}
      ],
      content: [
        {
          title: 'Unlimited users',
          included: [
            'true',
            'true'
          ]
        },      {
          title: 'Unlimited projects',
          included: [
            'true',
            'true'
          ]
        },
        {
          title: 'Unlimited skills',
          included: [
            'true',
            'true'
          ]
        },
        {
          title: 'AI assistant',
          included: [
            'false',
            'true'
          ]
        },
        {
          title: 'Support',
          included: [
            '09:00 - 16:00',
            '24/7/365'
          ]
        }
      ]
    };

  isMenuOpen: boolean = false;

  links: {name: string, anchor: string}[] = [
    {name: "Pricing", anchor: "pricing"},
    {name: "Features", anchor: "features"}
  ];

  scrollTo(element: any): void {
    (document.getElementById(element) as HTMLElement).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.getElementById('mobilenavMenu')?.classList.toggle('-translate-x-full');
  }

}
