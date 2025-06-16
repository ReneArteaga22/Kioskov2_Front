import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAvancesComponent } from './dashboard-avances.component';

describe('DashboardAvancesComponent', () => {
  let component: DashboardAvancesComponent;
  let fixture: ComponentFixture<DashboardAvancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAvancesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAvancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
