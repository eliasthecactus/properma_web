import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsmgtComponent } from './skillsmgt.component';

describe('SkillsmgtComponent', () => {
  let component: SkillsmgtComponent;
  let fixture: ComponentFixture<SkillsmgtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsmgtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SkillsmgtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
