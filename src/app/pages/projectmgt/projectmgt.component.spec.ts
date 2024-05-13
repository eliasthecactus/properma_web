import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectmgtComponent } from './projectmgt.component';

describe('ProjectmgtComponent', () => {
  let component: ProjectmgtComponent;
  let fixture: ComponentFixture<ProjectmgtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectmgtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectmgtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
