import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoporteRhComponent } from './soporte-rh.component';

describe('SoporteRhComponent', () => {
  let component: SoporteRhComponent;
  let fixture: ComponentFixture<SoporteRhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoporteRhComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoporteRhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
