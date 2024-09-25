import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloAsistenciaComponent } from './modulo-asistencia.component';

describe('ModuloAsistenciaComponent', () => {
  let component: ModuloAsistenciaComponent;
  let fixture: ComponentFixture<ModuloAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloAsistenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuloAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
