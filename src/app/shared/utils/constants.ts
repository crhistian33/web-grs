export const PARAMETERS = {
  CENTER: 'center',
  COMPANY: 'company',
  CUSTOMER: 'customer',
  SHIFT: 'shift',
  TYPEWORKER: 'typeworker',
  UNIT: 'unit',
  WORKER: 'worker',
  ASSIGNMENT: 'assignment',
  REASSIGNMENT: 'reassignment',
  ASSIST: 'assist',
  ASSIST_BREAKS: 'assist_breaks',
  BREAK: 'break',
}

export const IDENTIFIES = {
  CENTER: 'center_id',
  COMPANY: 'company_id',
  CUSTOMER: 'customer_id',
  SHIFT: 'shift_id',
  TYPEWORKER: 'type_worker_id',
  UNIT: 'unit_id',
  WORKER: 'worker_id',
  ASSIGNMENT: 'assignment_id',
  UNIT_SHIFT: 'unit_shift_id',
  WORKERS: 'workers',
  SHIFTS: 'shifts',
}

export const TITLES = {
  CENTERS: 'Centros de costo',
  CENTERS_REMOVE: 'Centros de costo removidos',
  COMPANIES: 'Empresas',
  COMPANIES_REMOVE: 'Empresas removidas',
  CUSTOMERS: 'Clientes',
  CUSTOMERS_REMOVE: 'Clientes removidos',
  SHIFTS: 'Turnos',
  SHIFTS_REMOVE: 'Turnos removidos',
  TYPEWORKERS: 'Tipos de trabajador',
  TYPEWORKERS_REMOVE: 'Tipos de trabajador removidos',
  UNITS: 'Unidades',
  UNITS_REMOVE: 'Unidades removidas',
  WORKERS: 'Trabajadores',
  WORKERS_REMOVE: 'Trabajadores removidos',
  ASSIGNMENTS: 'Asignaciones',
  ASSIGNMENTS_REMOVE: 'Asignaciones removidas',
  REASSIGNMENTS: 'Reasignaciones',
  CENTER: 'Centro de costo',
  COMPANY: 'Empresa',
  CUSTOMER: 'Cliente',
  SHIFT: 'Turno',
  TYPEWORKER: 'Tipo de trabajador',
  UNIT: 'Unidad',
  WORKER: 'Trabajador',
  ASSIGNMENT: 'Asignación',
  REASSIGNMENT: 'Reasignación',
  REASSIGN_WORKER: 'Reasignar trabajador',
  ASSIST: 'Asistencia',
  ASSISTS: 'Asistencias',
  UPDATE_ASSIST: 'Modificar asistencia',
  ASSIST_TITULARS: 'titulares',
  ASSIST_BREAKS: 'descanseros',
  BREAK: 'Descanso',
  BREAKS: 'Descansos',
  PERMISSIONS: 'Permisos',
}

export const TYPES = {
  LIST: 'lista',
  RECYCLE: 'papelera',
  NONE: 'none',
  REASSIGN: 'reasigna',
  ASSIST: 'asistencia'
}

export const MESSAGES = {
  CONFIRM_RESTORE: 'El registro se restaurará a la lista',
  CONFIRM_RESTORES: 'Los registros se restaurarán a la lista.',
  CONFIRM_DELETE: 'El registro se eliminará permanentemente.',
  CONFIRM_DELETES: 'Los registros se eliminarán permanentemente.',
  CONFIRM_DELETE_REMOVE: 'El registro se eliminará permanentemente o puedes removerlo a la papelera.',
  CONFIRM_DELETES_REMOVES: 'Los registros se eliminarán permanentemente o puedes removerlos a la papelera.',
  INVALID_RANGE_DATE: 'La fecha desde no puede ser mayor a la fecha hasta',
  INVALID_SUBMIT_FILTER_DATE: 'Ingresa las fechas desde y hasta',
}

export const ROUTES = {
  CENTER_LIST: '/mantenimiento/centros-costo',
  COMPANY_LIST: '/mantenimiento/empresas',
  CUSTOMER_LIST: '/mantenimiento/clientes',
  SHIFT_LIST: '/mantenimiento/turnos',
  TYPEWORKER_LIST: '/mantenimiento/tipos-trabajadores',
  UNIT_LIST: '/mantenimiento/unidades',
  WORKER_LIST: '/mantenimiento/trabajadores',
  ASSIGNMENT_LIST: '/tareo/asignaciones',
  ASSIST_LIST: '/tareo/asistencias',
  ASSIST_LIST_BREAKS: '/tareo/asistencias/descanseros',
  BREAK_LIST: '/tareo/descansos',
}

export const MONTHS = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre' ];

export const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
