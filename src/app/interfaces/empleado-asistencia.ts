// src/app/interfaces/empleado-asistencia.ts

export interface EmpleadoAsistencia {
  Numero: number;
  FirstName: string;
  MiddleName: string;
  Surname: string;
  NSS: string;
  BirthDay: string;
  Department: string;
  Plant: string;
  JobTitleSpanish: string;
  matx3: string;
  Activo: string;
  HiringDate: string;
  Baja: string;
  Shift: string;
  created_at: string;
  updated_at: string;
}

// Esta segunda interfaz mapea la respuesta completa de tu controlador
export interface EmpleadoResponse {
  status: string;
  data: EmpleadoAsistencia[];
}