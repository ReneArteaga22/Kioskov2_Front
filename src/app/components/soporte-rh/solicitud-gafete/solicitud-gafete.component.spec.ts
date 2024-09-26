import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudGafeteComponent } from './solicitud-gafete.component';

describe('SolicitudGafeteComponent', () => {
  let component: SolicitudGafeteComponent;
  let fixture: ComponentFixture<SolicitudGafeteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudGafeteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudGafeteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
