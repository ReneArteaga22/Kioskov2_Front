import { Component, OnInit, signal, inject, DestroyRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService, Amonestacion, ResumenEmpleado, Kpis, Empleado } from '../../service/api.service';
import { CNavBarComponent } from '../../components/c-nav-bar/c-nav-bar.component';
import ExcelJS from 'exceljs';
import { filter } from 'rxjs/operators'

interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

@Component({
  selector: 'app-amonestaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CNavBarComponent],
  templateUrl: './amonestaciones.component.html',
  styleUrl: './amonestaciones.component.css'
})
export class AmonestacionesComponent implements OnInit {

  // ── Signals de datos ────────────────────────────────────────────────────
  registros = signal<Amonestacion[]>([]);
  resumen   = signal<ResumenEmpleado[]>([]);
  kpis      = signal<Kpis>({ year: new Date().getFullYear(), total: 0, red: 0, yellow: 0, green: 0 });
  years     = signal<number[]>([new Date().getFullYear()]);

  // ── Autocomplete empleados ───────────────────────────────────────────────
sugerencias     = signal<Empleado[]>([]);
buscandoEmp     = signal(false);
mostrarDropdown = signal(false);
private empSubject = new Subject<string>();

  // ── Signals de UI ───────────────────────────────────────────────────────
  cargando    = signal(false);
  errorMsg    = signal<string | null>(null);
  toasts      = signal<Toast[]>([]);
  modalConfig = signal<{ visible: boolean; mensaje: string; onConfirm: () => void } | null>(null);

  // ── Filtros ─────────────────────────────────────────────────────────────
  filtroYear:   number = new Date().getFullYear();
  filtroPlanta: string = '';
  filtroQ:      string = '';

  // ── Formulario ──────────────────────────────────────────────────────────
  form!: FormGroup;
  editandoId: number | null = null;
  motivoMaxLen = 500;

  readonly plantas = ['Planta 1', 'Planta 2'];
  readonly deptos  = ['Producción', 'Calidad', 'Mantenimiento', 'Almacén', 'Seguridad', 'RH'];

  // ── Estado de colapso ────────────────────────────────────────────────────
  colapsadoForm    = signal(false);
  colapsadoResumen = signal(false);

// Altura de tablas (en px) — null = usa el max-height del CSS
  alturaTablaForm    = signal<number | null>(null);
  alturaTablaResumen = signal<number | null>(null);

  // ── Infraestructura ─────────────────────────────────────────────────────
  private searchSubject = new Subject<string>();
  private toastCounter  = 0;
  private destroyRef    = inject(DestroyRef);
  private toastTimers   = new Map<number, ReturnType<typeof setTimeout>>();
  private resizing: 'form' | 'resumen' | null = null;
  private resizeStartY  = 0;
  private resizeStartH  = 0;

  // ── Resize horizontal del grid ───────────────────────────────────────────
anchoIzq = signal<number | null>(null); // % de ancho de la card izquierda
private resizingGrid  = false;
private gridStartX    = 0;
private gridStartAncho = 0;
private gridContainer: HTMLElement | null = null;

  constructor(private apiService: ApiService, private fb: FormBuilder) {}

  // ── Escape cierra edición ───────────────────────────────────────────────
  @HostListener('document:keydown.escape')
onEscape() {
  if (this.mostrarDropdown()) {
    this.mostrarDropdown.set(false);
    return;
  }
  if (this.editandoId) this.resetForm();
  if (this.modalConfig()?.visible) this.cerrarModal();
}

  // ── Ciclo de vida ───────────────────────────────────────────────────────
  ngOnInit() {
    this.form = this.fb.group({
      fecha:        [this.hoy(),     Validators.required],
      hora:         [this.ahoraHH(), Validators.required],
      planta:       ['',             Validators.required],
      departamento: ['',             Validators.required],
      noEmpleado:   ['',             Validators.required],
      nombre:       ['',             Validators.required],
      puesto:       ['',             Validators.required],
      reporta:      ['',             Validators.required],
      motivo:       ['',            [Validators.required, Validators.maxLength(this.motivoMaxLen)]],
    });

    // Debounce en búsqueda — solo dispara si cambió y tras 350ms
    this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.cargar());

    this.empSubject.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  filter(v => v.length >= 2),
  takeUntilDestroyed(this.destroyRef)
).subscribe(q => {
  this.buscandoEmp.set(true);
  this.apiService.buscarEmpleados(q).subscribe({
    next: (lista) => {
      this.sugerencias.set(lista);
      this.mostrarDropdown.set(lista.length > 0);
      this.buscandoEmp.set(false);
    },
    error: () => {
      this.buscandoEmp.set(false);
      this.toast('error', 'Error al buscar empleados.');
    }
  });
});

    this.cargarYears();
    this.cargar();
  }

  onNoEmpleadoInput(valor: string) {
  if (!valor) {
    this.sugerencias.set([]);
    this.mostrarDropdown.set(false);
    return;
  }
  this.empSubject.next(valor.trim());
}

seleccionarEmpleado(emp: Empleado) {
  this.form.patchValue({
    noEmpleado:   emp.noEmpleado,
    nombre:       emp.nombre,
    puesto:       emp.puesto,
    departamento: emp.departamento,
    planta:       emp.planta,
  });
  this.sugerencias.set([]);
  this.mostrarDropdown.set(false);
  this.toast('info', `Empleado cargado: ${emp.nombre}`);
}

cerrarDropdown() {
  // Delay para que el click en la sugerencia alcance a ejecutarse antes de cerrar
  setTimeout(() => this.mostrarDropdown.set(false), 180);
}
  // ── Carga de datos ───────────────────────────────────────────────────────
  cargarYears() {
    this.apiService.getAmonestacionesYears().subscribe({
      next: ys => this.years.set(ys.length ? ys : [new Date().getFullYear()]),
      error: () => this.toast('error', 'No se pudieron cargar los años disponibles.')
    });
  }

  cargar() {
    this.cargando.set(true);
    this.errorMsg.set(null);
    const year = this.filtroYear;

    this.apiService.getAmonestacionesKpis(year).subscribe({
      next: k  => this.kpis.set(k),
      error: () => this.toast('error', 'Error al cargar KPIs.')
    });

    const filtros = {
      year,
      ...(this.filtroPlanta && { planta: this.filtroPlanta }),
      ...(this.filtroQ      && { q: this.filtroQ })
    };

    this.apiService.getAmonestaciones(filtros).subscribe({
      next: r => { this.registros.set(r); this.cargando.set(false); },
      error: () => {
        this.cargando.set(false);
        this.errorMsg.set('No se pudieron cargar los registros. Verifica la conexión al servidor.');
      }
    });

    this.apiService.getAmonestacionesResumen(year).subscribe({
      next: r  => this.resumen.set(r),
      error: () => this.toast('error', 'Error al cargar el resumen de reincidencia.')
    });
  }

  iniciarResize(event: MouseEvent | TouchEvent, tabla: 'form' | 'resumen') {
  event.preventDefault();
  this.resizing     = tabla;
  this.resizeStartY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
  this.resizeStartH = tabla === 'form'
    ? (this.alturaTablaForm()    ?? 380)
    : (this.alturaTablaResumen() ?? 440);
}

iniciarResizeGrid(event: MouseEvent | TouchEvent) {
  event.preventDefault();
  this.resizingGrid  = true;
  this.gridStartX    = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  this.gridStartAncho = this.anchoIzq() ?? 67; // default ~1.35fr de 2fr total

  // Referencia al contenedor del grid
  this.gridContainer = (event.target as HTMLElement)
    .closest('.main-grid-wrapper') as HTMLElement;

  document.body.classList.add('resizing-h');
}

@HostListener('document:mousemove', ['$event'])
@HostListener('document:touchmove', ['$event'])
onResizeMove(event: MouseEvent | TouchEvent) {
  // ── Resize vertical (tablas) ──
  if (this.resizing) {
    event.preventDefault();
    document.body.classList.add('resizing');
    const y    = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    const diff = y - this.resizeStartY;
    const nueva = Math.max(120, Math.min(800, this.resizeStartH + diff));
    if (this.resizing === 'form')    this.alturaTablaForm.set(nueva);
    if (this.resizing === 'resumen') this.alturaTablaResumen.set(nueva);
  }

  // ── Resize horizontal (grid) ──
  if (this.resizingGrid && this.gridContainer) {
    event.preventDefault();
    const x      = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const diff   = x - this.gridStartX;
    const totalW = this.gridContainer.offsetWidth;
    const diffPct = (diff / totalW) * 100;
    const nuevo  = Math.max(30, Math.min(80, this.gridStartAncho + diffPct));
    this.anchoIzq.set(nuevo);
  }
}

@HostListener('document:mouseup')
@HostListener('document:touchend')
onResizeEnd() {
  this.resizing     = null;
  this.resizingGrid = false;
  this.gridContainer = null;
  document.body.classList.remove('resizing');
  document.body.classList.remove('resizing-h');
}

resetAnchoGrid() {
  this.anchoIzq.set(null);
}

resetAlturaTabla(tabla: 'form' | 'resumen') {
  if (tabla === 'form')    this.alturaTablaForm.set(null);
  if (tabla === 'resumen') this.alturaTablaResumen.set(null);
}

  // ── Búsqueda con debounce ────────────────────────────────────────────────
  onSearchInput() {
    this.searchSubject.next(this.filtroQ);
  }

  // ── CRUD ─────────────────────────────────────────────────────────────────
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast('warning', 'Completa todos los campos obligatorios.');
      return;
    }

    const payload = this.form.value as Amonestacion;

    if (this.editandoId) {
      this.apiService.updateAmonestacion(this.editandoId, payload).subscribe({
        next: () => {
          this.toast('success', `Amonestación de ${payload.nombre} actualizada correctamente.`);
          this.resetForm();
          this.cargarYears();
          this.cargar();
        },
        error: () => this.toast('error', 'Error al actualizar la amonestación.')
      });
    } else {
      this.apiService.createAmonestacion(payload).subscribe({
        next: (res: any) => {
          if (res?.alerta) {
            this.toast('warning',
              `⚠ ${payload.nombre} (${payload.noEmpleado}) alcanzó ${res.totalAnio} amonestaciones en ${payload.fecha.slice(0, 4)}.`
            );
          } else {
            this.toast('success', `Amonestación registrada para ${payload.nombre}.`);
          }
          this.resetForm();
          this.cargarYears();
          this.cargar();
        },
        error: () => this.toast('error', 'Error al guardar la amonestación.')
      });
    }
  }

  editar(r: Amonestacion) {
    this.editandoId = r.id ?? null;
    this.form.patchValue({ ...r, fecha: r.fecha ? r.fecha.slice(0, 10) : this.hoy() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.toast('info', `Editando amonestación de ${r.nombre}.`);
  }

  eliminar(id: number, nombre: string) {
    this.abrirModal(
      `¿Eliminar la amonestación de ${nombre}? Esta acción no se puede deshacer.`,
      () => {
        this.apiService.deleteAmonestacion(id).subscribe({
          next: () => {
            this.toast('success', 'Registro eliminado correctamente.');
            this.cargar();
          },
          error: () => this.toast('error', 'Error al eliminar el registro.')
        });
      }
    );
  }

  resetForm() {
    this.editandoId = null;
    this.form.reset({ fecha: this.hoy(), hora: this.ahoraHH() });
  }

 // ── Exportar registros completos (.xlsx) ─────────────────────────────────
async exportarXLSX() {
  const rows = this.registros();
  if (!rows.length) {
    this.toast('warning', 'No hay registros para exportar.');
    return;
  }

  const wb  = new ExcelJS.Workbook();
  wb.creator  = 'Sistema de Amonestaciones';
  wb.created  = new Date();

  const ws = wb.addWorksheet('Registros', {
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true }
  });

  // ── Fila de título ──────────────────────────────────────────────────────
  ws.mergeCells('A1:J1');
  const titleCell = ws.getCell('A1');
  titleCell.value    = `Control de Amonestaciones — Año ${this.filtroYear}`;
  titleCell.font     = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill     = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0B1F3B' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  ws.getRow(1).height = 32;

  // ── Fila de metadatos ───────────────────────────────────────────────────
  ws.mergeCells('A2:J2');
  const metaCell = ws.getCell('A2');
  const filtrosActivos = [
    this.filtroPlanta ? `Planta: ${this.filtroPlanta}` : 'Todas las plantas',
    this.filtroQ      ? `Búsqueda: "${this.filtroQ}"`  : null,
  ].filter(Boolean).join(' · ');
  metaCell.value     = `Generado: ${new Date().toLocaleString('es-MX')}  |  ${filtrosActivos}  |  Total: ${rows.length} registros`;
  metaCell.font      = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF667085' } };
  metaCell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF6F8FB' } };
  metaCell.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(2).height = 20;

  // ── Fila de encabezados ─────────────────────────────────────────────────
  const headers = [
    { header: '#',            key: 'idx',          width: 5  },
    { header: 'Fecha',        key: 'fecha',         width: 13 },
    { header: 'Hora',         key: 'hora',          width: 8  },
    { header: 'Planta',       key: 'planta',        width: 14 },
    { header: 'Departamento', key: 'departamento',  width: 18 },
    { header: 'No. Empleado', key: 'noEmpleado',    width: 14 },
    { header: 'Nombre',       key: 'nombre',        width: 28 },
    { header: 'Puesto',       key: 'puesto',        width: 18 },
    { header: 'Reporta',      key: 'reporta',       width: 24 },
    { header: 'Motivo',       key: 'motivo',        width: 50 },
  ];

  ws.columns = headers;

  const headerRow = ws.getRow(3);
  headerRow.height = 22;
  headers.forEach((_, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.font      = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F6FEB' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border    = this.borderThin();
  });

  // ── Filas de datos ──────────────────────────────────────────────────────
  rows.forEach((r, i) => {
    const row = ws.addRow({
      idx:          i + 1,
      fecha:        this.fmtFecha(r.fecha),
      hora:         r.hora,
      planta:       r.planta,
      departamento: r.departamento,
      noEmpleado:   r.noEmpleado,
      nombre:       r.nombre,
      puesto:       r.puesto,
      reporta:      r.reporta,
      motivo:       r.motivo,
    });

    row.height = 18;
    const isEven = i % 2 === 0;

    row.eachCell(cell => {
      cell.font      = { name: 'Calibri', size: 10 };
      cell.alignment = { vertical: 'middle', wrapText: false };
      cell.fill      = {
        type: 'pattern', pattern: 'solid',
        fgColor: { argb: isEven ? 'FFFFFFFF' : 'FFF6F8FB' }
      };
      cell.border = this.borderThin();
    });

    // No. empleado en negrita
    const empCell = row.getCell('noEmpleado');
    empCell.font = { name: 'Calibri', size: 10, bold: true };

    // Motivo con wrap
    const motivoCell = row.getCell('motivo');
    motivoCell.alignment = { vertical: 'middle', wrapText: true };
  });

  // ── Fila de totales ─────────────────────────────────────────────────────
  const totalRow = ws.addRow({ idx: '', fecha: '', hora: '', planta: '', departamento: '', noEmpleado: 'TOTAL', nombre: `${rows.length} registros`, puesto: '', reporta: '', motivo: '' });
  totalRow.height = 20;
  totalRow.eachCell(cell => {
    cell.font = { name: 'Calibri', size: 10, bold: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F0FE' } };
    cell.border = this.borderThin();
  });

  // ── Inmovilizar encabezados ─────────────────────────────────────────────
  ws.views = [{ state: 'frozen', ySplit: 3, xSplit: 0, activeCell: 'A4' }];

  await this.saveWorkbook(wb, `registros_${this.filtroYear}_${Date.now()}.xlsx`);
  this.toast('success', `Excel exportado con ${rows.length} registros.`);
}

// ── Exportar alertas ROJO (.xlsx) ─────────────────────────────────────────
async descargarAlertas() {
  const todosResumen = this.resumen();
  if (!todosResumen.length) {
    this.toast('info', 'No hay datos en el resumen para este año.');
    return;
  }

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Sistema de Amonestaciones';
  wb.created = new Date();

  // ── Hoja 1: Solo ROJO ──────────────────────────────────────────────────
  const wsRojo = wb.addWorksheet('⚠ Alertas ROJO');
  this.buildResumenSheet(wsRojo, todosResumen.filter(x => x.semaforo === 'rojo'), 'Empleados en Estado ROJO — Acción inmediata requerida', 'FFD92D20');

  // ── Hoja 2: Resumen completo ───────────────────────────────────────────
  const wsCompleto = wb.addWorksheet('Resumen Completo');
  this.buildResumenSheet(wsCompleto, todosResumen, `Resumen de Reincidencia — Año ${this.filtroYear}`, 'FF0B1F3B');

  // ── Hoja 3: Estadísticas ───────────────────────────────────────────────
  const wsStats = wb.addWorksheet('Estadísticas');
  this.buildStatsSheet(wsStats, todosResumen);

  const rojos = todosResumen.filter(x => x.semaforo === 'rojo').length;
  await this.saveWorkbook(wb, `reincidencia_${this.filtroYear}.xlsx`);
  this.toast(rojos > 0 ? 'warning' : 'success',
    `Excel exportado: ${rojos} en ROJO, ${todosResumen.length} total.`
  );
}

// ── Exportar JSON ─────────────────────────────────────────────────────────
exportarJSON() {
  this.apiService.exportAmonestacionesJSON().subscribe({
    next: (data) => {
      this.download(
        `amonestaciones_${Date.now()}.json`,
        JSON.stringify(data, null, 2),
        'application/json'
      );
      this.toast('success', 'Exportación JSON completada.');
    },
    error: () => this.toast('error', 'Error al exportar los datos.')
  });
}

// ── Helpers privados de Excel ─────────────────────────────────────────────
private buildResumenSheet(
  ws: ExcelJS.Worksheet,
  rows: ResumenEmpleado[],
  titulo: string,
  colorTitulo: string
) {
  const cols = [
    { header: 'No. Empleado', key: 'no_empleado',  width: 14 },
    { header: 'Nombre',       key: 'nombre',        width: 30 },
    { header: 'Planta',       key: 'planta',        width: 14 },
    { header: 'Departamento', key: 'departamento',  width: 18 },
    { header: 'Amonestaciones', key: 'conteo',      width: 16 },
    { header: 'Estado',       key: 'semaforo',      width: 12 },
    { header: 'Última fecha', key: 'last_fecha',    width: 14 },
  ];

  // Título
  ws.mergeCells(`A1:G1`);
  const t = ws.getCell('A1');
  t.value     = titulo;
  t.font      = { name: 'Calibri', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  t.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorTitulo } };
  t.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(1).height = 30;

  // Metadatos
  ws.mergeCells('A2:G2');
  const m = ws.getCell('A2');
  m.value     = `Año ${this.filtroYear}  ·  Total empleados: ${rows.length}  ·  Generado: ${new Date().toLocaleString('es-MX')}`;
  m.font      = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF667085' } };
  m.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };
  m.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(2).height = 18;

  ws.columns = cols;

  // Encabezados
  const hr = ws.getRow(3);
  hr.height = 22;
  cols.forEach((_, i) => {
    const c = hr.getCell(i + 1);
    c.font      = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF334155' } };
    c.alignment = { horizontal: 'center', vertical: 'middle' };
    c.border    = this.borderThin();
  });

  // Datos con color por semáforo
  const colorMap: Record<string, { row: string; text: string }> = {
    rojo:     { row: 'FFFEF2F2', text: 'FFD92D20' },
    amarillo: { row: 'FFFFFBEB', text: 'FF93580A' },
    verde:    { row: 'FFF0FDF4', text: 'FF0A6641' },
  };

  rows.forEach((r, i) => {
    const row = ws.addRow({
      no_empleado:  r.no_empleado,
      nombre:       r.nombre,
      planta:       r.planta,
      departamento: r.departamento,
      conteo:       r.conteo,
      semaforo:     ({ rojo: 'ROJO ⛔', amarillo: 'AMARILLO ⚠', verde: 'VERDE ✓' } as any)[r.semaforo] ?? r.semaforo,
      last_fecha:   this.fmtFecha(r.last_fecha),
    });

    row.height = 18;
    const colors = colorMap[r.semaforo] ?? colorMap['verde'];

    row.eachCell(cell => {
      cell.font      = { name: 'Calibri', size: 10 };
      cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: i % 2 === 0 ? colors.row : 'FFFFFFFF' } };
      cell.alignment = { vertical: 'middle' };
      cell.border    = this.borderThin();
    });

    // No. empleado y conteo en negrita
    row.getCell('no_empleado').font = { name: 'Calibri', size: 10, bold: true };
    const conteoCell = row.getCell('conteo');
    conteoCell.font      = { name: 'Calibri', size: 11, bold: true, color: { argb: colors.text } };
    conteoCell.alignment = { horizontal: 'center', vertical: 'middle' };

    const semCell = row.getCell('semaforo');
    semCell.font      = { name: 'Calibri', size: 10, bold: true, color: { argb: colors.text } };
    semCell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  ws.views = [{ state: 'frozen', ySplit: 3 }];
}

private buildStatsSheet(ws: ExcelJS.Worksheet, resumen: ResumenEmpleado[]) {
  const rojos     = resumen.filter(x => x.semaforo === 'rojo').length;
  const amarillos = resumen.filter(x => x.semaforo === 'amarillo').length;
  const verdes    = resumen.filter(x => x.semaforo === 'verde').length;

  // Conteo por planta
  const porPlanta: Record<string, number> = {};
  resumen.forEach(r => {
    porPlanta[r.planta] = (porPlanta[r.planta] ?? 0) + Number(r.conteo);
  });

  // Conteo por departamento
  const porDepto: Record<string, number> = {};
  resumen.forEach(r => {
    porDepto[r.departamento] = (porDepto[r.departamento] ?? 0) + Number(r.conteo);
  });

  ws.columns = [
    { key: 'label', width: 30 },
    { key: 'value', width: 16 },
  ];

  const addTitle = (text: string, color: string) => {
    ws.mergeCells(`A${ws.rowCount + 1}:B${ws.rowCount + 1}`);
    const r = ws.lastRow!;
    r.height = 22;
    const c = r.getCell(1);
    c.value = text;
    c.font  = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
    c.alignment = { horizontal: 'center', vertical: 'middle' };
  };

  const addRow = (label: string, value: string | number, bgArgb = 'FFFFFFFF') => {
    const r = ws.addRow({ label, value });
    r.height = 18;
    r.eachCell(c => {
      c.font      = { name: 'Calibri', size: 10 };
      c.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgArgb } };
      c.alignment = { vertical: 'middle' };
      c.border    = this.borderThin();
    });
    r.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
  };

  addTitle(`Estadísticas — Año ${this.filtroYear}`, 'FF0B1F3B');
  ws.addRow({});

  addTitle('Semáforo de reincidencia', 'FF334155');
  addRow('🔴 Empleados en ROJO (≥ 3 amonestaciones)',     rojos,     'FFFEF2F2');
  addRow('🟡 Empleados en AMARILLO (2 amonestaciones)',   amarillos, 'FFFFFBEB');
  addRow('🟢 Empleados en VERDE (0–1 amonestaciones)',    verdes,    'FFF0FDF4');
  addRow('Total empleados con amonestaciones',            resumen.length);
  ws.addRow({});

  addTitle('Amonestaciones por planta', 'FF334155');
  Object.entries(porPlanta).sort((a, b) => b[1] - a[1]).forEach(([planta, total], i) => {
    addRow(planta, total, i % 2 === 0 ? 'FFF6F8FB' : 'FFFFFFFF');
  });
  ws.addRow({});

  addTitle('Amonestaciones por departamento', 'FF334155');
  Object.entries(porDepto).sort((a, b) => b[1] - a[1]).forEach(([depto, total], i) => {
    addRow(depto, total, i % 2 === 0 ? 'FFF6F8FB' : 'FFFFFFFF');
  });
}

private borderThin(): Partial<ExcelJS.Borders> {
  const s: Partial<ExcelJS.Border> = { style: 'thin', color: { argb: 'FFD0D5DD' } };
  return { top: s, left: s, bottom: s, right: s };
}

private async saveWorkbook(wb: ExcelJS.Workbook, filename: string) {
  const buffer = await wb.xlsx.writeBuffer();
  const blob   = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  a.remove(); URL.revokeObjectURL(url);
}

  // ── Modal de confirmación ────────────────────────────────────────────────
  abrirModal(mensaje: string, onConfirm: () => void) {
    this.modalConfig.set({ visible: true, mensaje, onConfirm });
  }

  confirmarModal() {
    this.modalConfig()?.onConfirm();
    this.cerrarModal();
  }

  cerrarModal() {
    this.modalConfig.set(null);
  }

  // ── Sistema de toasts ────────────────────────────────────────────────────
  toast(type: Toast['type'], message: string, duration = 4000) {
    const id = ++this.toastCounter;
    this.toasts.update(t => [...t, { id, type, message }]);
    const timer = setTimeout(() => this.removeToast(id), duration);
    this.toastTimers.set(id, timer);
  }

  removeToast(id: number) {
    clearTimeout(this.toastTimers.get(id));
    this.toastTimers.delete(id);
    this.toasts.update(t => t.filter(x => x.id !== id));
  }

  // ── Helpers de template ──────────────────────────────────────────────────
  get motivoLen(): number {
    return this.form.get('motivo')?.value?.length ?? 0;
  }

  fmtFecha(iso: string): string {
    if (!iso) return '';
    const [y, m, d] = iso.slice(0, 10).split('-');
    return `${d}/${m}/${y}`;
  }

  pillClass(sem: string): string {
    return ({ rojo: 'pill red', amarillo: 'pill yellow', verde: 'pill green' } as any)[sem] ?? 'pill green';
  }

  pillLabel(sem: string): string {
    return ({ rojo: 'ROJO', amarillo: 'AMARILLO', verde: 'VERDE' } as any)[sem] ?? 'VERDE';
  }

  toastIcon(type: Toast['type']): string {
    return { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' }[type];
  }

  invalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }

  private download(filename: string, content: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    a.remove(); URL.revokeObjectURL(url);
  }

  private hoy()     { return new Date().toISOString().slice(0, 10); }
  private ahoraHH() { return new Date().toTimeString().slice(0, 5); }
}