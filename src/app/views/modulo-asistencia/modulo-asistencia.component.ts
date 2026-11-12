import { Component, OnInit } from '@angular/core';
import { CNavBarComponent } from '../../components/c-nav-bar/c-nav-bar.component';
import { EmployeeService } from '../../services/employee.service';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { HttpClientModule } from '@angular/common/http';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-modulo-asistencia',
  standalone: true,
  imports: [
    CNavBarComponent,
    NgIf,
    NgFor,
    TableModule,
    TagModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    HttpClientModule,
    CommonModule,
    MultiSelectModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    FormsModule,
    DialogModule
  ],
  templateUrl: './modulo-asistencia.component.html',
  styles: [
    `
      :host ::ng-deep {
        .p-paginator {
          .p-paginator-current {
            margin-left: auto;
          }
        }

        .p-progressbar {
          height: 0.5rem;
          background-color: #d8dadc;

          .p-progressbar-value {
            background-color: #607d8b;
          }
        }

        .table-header {
          display: flex;
          justify-content: space-between;
        }

        .p-calendar .p-datepicker {
          min-width: 25rem;

          td {
            font-weight: 400;
          }
        }

        .p-datatable.p-datatable-customers {
          .p-datatable-header {
            padding: 1rem;
            text-align: left;
            font-size: 1.5rem;
          }

          .p-paginator {
            padding: 1rem;
          }

          .p-datatable-thead > tr > th {
            text-align: left;
          }

          .p-datatable-tbody > tr > td {
            cursor: auto;
          }

          .p-select-label:not(.p-placeholder) {
            text-transform: uppercase;
          }
        }

        .p-w-100 {
          width: 100%;
        }

        /* Responsive */
        .p-datatable-customers .p-datatable-tbody > tr > td .p-column-title {
          display: none;
        }
      }

      @media screen and (max-width: 960px) {
        :host ::ng-deep {
          .p-datatable {
            &.p-datatable-customers {
              .p-datatable-thead > tr > th,
              .p-datatable-tfoot > tr > td {
                display: none !important;
              }

              .p-datatable-tbody > tr {
                border-bottom: 1px solid var(--layer-2);

                > td {
                  text-align: left;
                  width: 100%;
                  display: flex;
                  align-items: center;
                  border: 0 none;

                  .p-column-title {
                    min-width: 30%;
                    display: inline-block;
                    font-weight: bold;
                  }

                  p-progressbar {
                    width: 100%;
                  }

                  &:last-child {
                    border-bottom: 1px solid var(--surface-d);
                  }
                }
              }
            }
          }
        }
      }
    `
  ]
})
export class ModuloAsistenciaComponent implements OnInit {
  employees: any[] = [];
  selectedEmployee: any = {};
  loading: boolean = true;
  visible: boolean = false;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        // Tu API regresa { titulo: 'Exito', usuarios: [...] }
        const usuarios = data.usuarios;

        // Validar si viene arreglo
        if (!Array.isArray(usuarios)) {
          console.error('Respuesta inesperada de la API', data);
          this.loading = false;
          return;
        }

        this.employees = usuarios.map((emp: any) => ({
          ...emp,
          // Construimos la URL de la foto por número de empleado
          fotoUrl: `http://192.168.1.131:3333/fotos/${emp.num_emp}.jpg`
        }));

        this.loading = false;
        console.log('Empleados cargados:', this.employees);
      },
      error: (err) => {
        console.error('Error al obtener empleados:', err);
        this.loading = false;
      }
    });
  }

  showDialog(employee: any): void {
    this.selectedEmployee = { ...employee };
    this.visible = true;
  }
}