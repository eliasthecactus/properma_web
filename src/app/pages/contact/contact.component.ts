import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  providers: [ApiService],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  subject = "";
  message = "";

  constructor(public apiService: ApiService, public alertService: AlertService) {

  }

  sendMessage() {
    this.apiService.contact(this.subject, this.message).subscribe(
      (response) => {
        console.log(response);

        if (response.code == 0) {
          this.alertService.show("success", "Message sent successfully")
          this.subject = "";
          this.message = "";
        } else {
          this.alertService.show("error", response.message)
        }
      },
      (error) => {
        this.alertService.show("error", "There was an error while sending the message")
      }
    );
  }

}
