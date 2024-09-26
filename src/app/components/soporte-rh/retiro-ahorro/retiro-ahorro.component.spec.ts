import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetiroAhorroComponent } from './retiro-ahorro.component';

describe('RetiroAhorroComponent', () => {
  let component: RetiroAhorroComponent;
  let fixture: ComponentFixture<RetiroAhorroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetiroAhorroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetiroAhorroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
