import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanerComponent } from './planer.component';

describe('PlanerComponent', () => {
  let component: PlanerComponent;
  let fixture: ComponentFixture<PlanerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlanerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
