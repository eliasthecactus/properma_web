import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-feedback-card',
  standalone: true,
  imports: [],
  templateUrl: './feedback-card.component.html',
  styleUrl: './feedback-card.component.css'
})
export class FeedbackCardComponent {

  @Input() name: string = 'Feedback Card Name';
  @Input() company: string = 'Feedback Card Company';
  @Input() position: string = 'Feedback Card Position';
  @Input() image: string = 'https://thispersondoesnotexist.com/';
  @Input() text: string = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi rerum corporis porro laudantium, quam assumenda perferendis voluptatibus harum voluptas aperiam quae eveniet dolorem tempora fuga, nostrum debitis neque praesentium quis?';

}
