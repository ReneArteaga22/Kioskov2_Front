import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvAdminComponent } from './inv-admin.component';

describe('InvAdminComponent', () => {
  let component: InvAdminComponent;
  let fixture: ComponentFixture<InvAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
