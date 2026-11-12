import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable, concatMap, forkJoin, from, of, catchError, toArray } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Area, EquipoCat, InvCatalogosService, Integrante, LocalidadCat } from './inv-catalogos.service';

interface Opcion<T> { label: string; value: T; }

// ⚠️ Ajusta a los roles definidos en app/services/inventario/constantes.ts
const ROLES = ['LIDER', 'CONTADOR', 'CAPTURISTA'];

@Component({
  selector: 'app-inv-catalogos',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, TabViewModule, TableModule, ButtonModule, InputTextModule,
    InputTextareaModule, DropdownModule, InputSwitchModule, TagModule, DialogModule, ToastModule,
    TooltipModule, ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './inv-catalogos.component.html',
  styleUrls: ['./inv-catalogos.component.css'],
})
export class InvCatalogosComponent implements OnInit {
  tab = 0;
  cargando = true;
  ocupado = false;

  areas: Area[] = [];
  equipos: EquipoCat[] = [];
  localidades: LocalidadCat[] = [];

  opcionesArea: Opcion<number>[] = [];
  opcionesEquipo: Opcion<number>[] = [];
  readonly opcionesRol: Opcion<string>[] = ROLES.map((r) => ({ label: r, value: r }));

  // Filtros
  qEquipo = '';
  qLocalidad = '';
  fArea: number | null = null;
  fEquipo: number | null = null;
  soloSinEquipo = false;
  equiposVista: EquipoCat[] = [];
  localidadesVista: LocalidadCat[] = [];

  // Selección de equipo (para miembros)
  equipoSel: EquipoCat | null = null;

  // Diálogos
  dlgArea = { visible: false, id: null as number | null, codigo: '', nombre: '' };
  dlgEquipo = { visible: false, id: null as number | null, nombre: '', activo: true };
  dlgMiembro = { visible: false, id: null as number | null, nombreCompleto: '', rol: 'CONTADOR' };
  dlgLocalidad = { visible: false, id: null as number | null, areaId: null as number | null, nombre: '', equipoPlaneadoId: null as number | null };
  dlgMasivo = { visible: false, texto: '', previa: [] as { areaId: number | null; area: string; nombre: string; equipoId: number | null; equipo: string; error: string }[] };

  constructor(private cat: InvCatalogosService, private toast: MessageService, private confirm: ConfirmationService) {}

  ngOnInit(): void { this.cargar(); }

  // ═════════ CARGA ═════════
  cargar(): void {
    this.cargando = true;
    forkJoin({ areas: this.cat.areas(), equipos: this.cat.equipos(), localidades: this.cat.localidades() }).subscribe({
      next: ({ areas, equipos, localidades }) => {
        this.areas = areas;
        this.equipos = equipos;
        this.localidades = localidades;
        this.opcionesArea = areas.map((a) => ({ label: `${a.codigo} · ${a.nombre}`, value: a.id }));
        this.opcionesEquipo = equipos.filter((e) => e.activo !== false).map((e) => ({ label: e.nombre, value: e.id }));
        if (this.equipoSel) this.equipoSel = equipos.find((e) => e.id === this.equipoSel!.id) ?? null;
        this.filtrar();
        this.cargando = false;
      },
      error: (e) => { this.cargando = false; this.error(e); },
    });
  }

  filtrar(): void {
    const qe = this.qEquipo.trim().toUpperCase();
    this.equiposVista = this.equipos.filter((e) =>
      !qe || e.nombre.toUpperCase().includes(qe) ||
      (e.integrantes ?? []).some((i) => i.nombreCompleto.toUpperCase().includes(qe)));

    const ql = this.qLocalidad.trim().toUpperCase();
    this.localidadesVista = this.localidades.filter((l) =>
      (!ql || l.nombre.toUpperCase().includes(ql)) &&
      (!this.fArea || l.areaId === this.fArea) &&
      (!this.fEquipo || l.equipoPlaneadoId === this.fEquipo) &&
      (!this.soloSinEquipo || !l.equipoPlaneadoId));
  }

  limpiarFiltrosLoc(): void {
    this.qLocalidad = ''; this.fArea = null; this.fEquipo = null; this.soloSinEquipo = false; this.filtrar();
  }

  // ═════════ CONTADORES ═════════
  locsDeEquipo(id: number): number { return this.localidades.filter((l) => l.equipoPlaneadoId === id).length; }
  locsDeArea(id: number): number { return this.localidades.filter((l) => l.areaId === id).length; }
  get sinEquipo(): number { return this.localidades.filter((l) => !l.equipoPlaneadoId).length; }
  nombreArea(l: LocalidadCat): string { return l.area?.codigo ?? this.areas.find((a) => a.id === l.areaId)?.codigo ?? '—'; }
  nombreEquipo(l: LocalidadCat): string {
    return l.equipoPlaneado?.nombre ?? this.equipos.find((e) => e.id === l.equipoPlaneadoId)?.nombre ?? '';
  }

  // ═════════ ÁREAS ═════════
  abrirArea(a?: Area): void {
    this.dlgArea = { visible: true, id: a?.id ?? null, codigo: a?.codigo ?? '', nombre: a?.nombre ?? '' };
  }
  guardarArea(): void {
    const d = this.dlgArea;
    const body = { codigo: d.codigo.trim().toUpperCase(), nombre: d.nombre.trim() };
    if (!body.codigo || !body.nombre) return this.aviso('Captura código y nombre');
    this.ejecutar(d.id ? this.cat.editarArea(d.id, body) : this.cat.crearArea(body), () => (this.dlgArea.visible = false));
  }
  eliminarArea(a: Area): void {
    this.confirmar(`¿Eliminar el área ${a.codigo}?`, () => this.ejecutar(this.cat.eliminarArea(a.id)));
  }

  // ═════════ EQUIPOS ═════════
  abrirEquipo(e?: EquipoCat): void {
    this.dlgEquipo = { visible: true, id: e?.id ?? null, nombre: e?.nombre ?? '', activo: e?.activo ?? true };
  }
  guardarEquipo(): void {
    const d = this.dlgEquipo;
    const body = { nombre: d.nombre.trim(), activo: d.activo };
    if (!body.nombre) return this.aviso('Captura el nombre del equipo');
    this.ejecutar(d.id ? this.cat.editarEquipo(d.id, body) : this.cat.crearEquipo(body), () => (this.dlgEquipo.visible = false));
  }
  toggleActivo(e: EquipoCat): void {
    this.ejecutar(this.cat.editarEquipo(e.id, { nombre: e.nombre, activo: !e.activo }));
  }
  eliminarEquipo(e: EquipoCat): void {
    this.confirmar(`¿Eliminar ${e.nombre}? Si tiene listas, mejor desactívalo.`, () => {
      if (this.equipoSel?.id === e.id) this.equipoSel = null;
      this.ejecutar(this.cat.eliminarEquipo(e.id));
    });
  }
  seleccionarEquipo(e: EquipoCat): void { this.equipoSel = this.equipoSel?.id === e.id ? null : e; }

  // ═════════ MIEMBROS ═════════
  abrirMiembro(i?: Integrante): void {
    if (!this.equipoSel) return this.aviso('Selecciona un equipo');
    this.dlgMiembro = { visible: true, id: i?.id ?? null, nombreCompleto: i?.nombreCompleto ?? '', rol: i?.rol ?? 'CONTADOR' };
  }
  guardarMiembro(seguir = false): void {
    const d = this.dlgMiembro;
    const body = { nombreCompleto: d.nombreCompleto.trim(), rol: d.rol };
    if (!body.nombreCompleto) return this.aviso('Captura el nombre');
    const op = d.id ? this.cat.editarIntegrante(d.id, body) : this.cat.crearIntegrante(this.equipoSel!.id, body);
    this.ejecutar(op, () => {
      if (seguir && !d.id) this.dlgMiembro.nombreCompleto = '';
      else this.dlgMiembro.visible = false;
    });
  }
  eliminarMiembro(i: Integrante): void {
    this.confirmar(`¿Quitar a ${i.nombreCompleto} del equipo?`, () => this.ejecutar(this.cat.eliminarIntegrante(i.id)));
  }

  // ═════════ LOCALIDADES ═════════
  abrirLocalidad(l?: LocalidadCat): void {
    this.dlgLocalidad = {
      visible: true, id: l?.id ?? null, areaId: l?.areaId ?? this.fArea,
      nombre: l?.nombre ?? '', equipoPlaneadoId: l?.equipoPlaneadoId ?? null,
    };
  }
  guardarLocalidad(seguir = false): void {
    const d = this.dlgLocalidad;
    if (!d.areaId || !d.nombre.trim()) return this.aviso('Captura área y nombre');
    const body = { areaId: d.areaId, nombre: d.nombre.trim(), equipoPlaneadoId: d.equipoPlaneadoId };
    const op = d.id ? this.cat.editarLocalidad(d.id, body) : this.cat.crearLocalidad(body);
    this.ejecutar(op, () => {
      if (seguir && !d.id) this.dlgLocalidad.nombre = '';
      else this.dlgLocalidad.visible = false;
    });
  }
  /** Cambio rápido de equipo planeado desde la tabla */
  asignarEquipo(l: LocalidadCat, equipoId: number | null): void {
    this.ejecutar(this.cat.editarLocalidad(l.id, { areaId: l.areaId, nombre: l.nombre, equipoPlaneadoId: equipoId }));
  }
  eliminarLocalidad(l: LocalidadCat): void {
    this.confirmar(`¿Eliminar la localidad ${l.nombre}?`, () => this.ejecutar(this.cat.eliminarLocalidad(l.id)));
  }

  // ═════════ CARGA MASIVA (pegar desde Excel: ÁREA | LOCALIDAD | EQUIPO opcional) ═════════
  abrirMasivo(): void { this.dlgMasivo = { visible: true, texto: '', previa: [] }; }

  previsualizar(): void {
    const norm = (s: string) => s.trim().toUpperCase();
    this.dlgMasivo.previa = this.dlgMasivo.texto.split(/\r?\n/).map((r) => r.split('\t')).filter((c) => c.join('').trim())
      .map(([a = '', n = '', e = '']) => {
        const area = this.areas.find((x) => norm(x.codigo) === norm(a));
        const equipo = e.trim() ? this.equipos.find((x) => norm(x.nombre) === norm(e)) : undefined;
        const dup = area && this.localidades.some((l) => l.areaId === area.id && norm(l.nombre) === norm(n));
        const error = !area ? `Área "${a.trim()}" no existe`
          : !n.trim() ? 'Sin nombre'
          : e.trim() && !equipo ? `Equipo "${e.trim()}" no existe`
          : dup ? 'Ya existe' : '';
        return { areaId: area?.id ?? null, area: a.trim(), nombre: n.trim(), equipoId: equipo?.id ?? null, equipo: e.trim(), error };
      });
  }
  get masivoValidas() { return this.dlgMasivo.previa.filter((p) => !p.error); }

  cargarMasivo(): void {
    const filas = this.masivoValidas;
    if (!filas.length) return this.aviso('No hay filas válidas');
    this.ocupado = true;
    from(filas).pipe(
      concatMap((f) => this.cat.crearLocalidad({ areaId: f.areaId!, nombre: f.nombre, equipoPlaneadoId: f.equipoId })
        .pipe(catchError(() => of(null)))),
      toArray(),
    ).subscribe((res) => {
      const ok = res.filter(Boolean).length;
      this.ok(`${ok} de ${filas.length} localidades creadas`);
      if (ok < filas.length) this.aviso(`${filas.length - ok} fallaron; revisa duplicados`);
      this.dlgMasivo.visible = false;
      this.fin();
    });
  }

  // ═════════ AUXILIARES ═════════
  private ejecutar(op: Observable<any>, despues?: () => void): void {
    this.ocupado = true;
    op.subscribe({
      next: (r) => { this.ok(r?.mensaje ?? 'Guardado'); despues?.(); this.fin(); },
      error: (e) => { this.ocupado = false; this.error(e); },
    });
  }
  private fin(): void { this.ocupado = false; this.cargar(); }
  private confirmar(message: string, accept: () => void): void {
    this.confirm.confirm({
      header: 'Confirmar', message, icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí', rejectLabel: 'Cancelar', acceptButtonStyleClass: 'p-button-danger', accept,
    });
  }
  private ok(detail: string): void { this.toast.add({ severity: 'success', summary: 'Listo', detail, life: 2500 }); }
  private aviso(detail: string): void { this.toast.add({ severity: 'warn', summary: 'Revisa', detail, life: 3500 }); }
  private error(e: any): void {
    const detail = e?.error?.mensaje ?? e?.error?.message ?? e?.error?.errors?.[0]?.message ?? e?.message ?? 'Error inesperado';
    this.toast.add({ severity: 'error', summary: 'Error', detail, life: 5000 });
  }
}
