import { IModule } from "@shared/models/form.model";
import { PARAMETERS } from "./constants";

export const FORM_MODULE: { [key: string]: IModule } = {
  worker: {
    name: PARAMETERS.WORKER,
    fields: [
      {
        name: 'type_worker_id',
        label: 'Tipo de trabajador',
        type: 'select',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'El tipo de trabajador es requerido',
          }
        ]
      },
      {
        name: 'name',
        label: 'Nombres y apellidos',
        type: 'text',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'El nombre es requerido',
          }
        ]
      },
      {
        name: 'dni',
        label: 'DNI',
        type: 'text',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'El DNI es requerido',
          }
        ]
      },
      {
        name: 'birth_date',
        label: 'Fecha Nac.',
        type: 'date',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'La fecha de nacimiento es requerida',
          }
        ]
      },
      {
        name: 'company_id',
        label: 'Empresa',
        type: 'select',
        prefix: false,
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'La empresa es requerida',
          }
        ]
      },
    ]
  },
  typeworker: {
    name: PARAMETERS.TYPEWORKER,
    fields: [
      {
        name: 'name',
        label: 'Nombre',
        type: 'text',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'El nombre es requerido',
          },
          {
            name: 'maxlength',
            validator: 'maxLength(20)',
            message: 'El nombre debe contener hasta 20 dígitos',
          }
        ]
      },
    ]
  },
  center: {
    name: PARAMETERS.CENTER,
    fields: [
      {
        name: 'code',
        label: 'Código',
        type: 'text',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'El código es requerido',
          },
        ]
      },
      {
        name: 'name',
        label: 'Nombre',
        type: 'text',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'El nombre es requerido',
          },
        ]
      },
      {
        name: 'mount',
        label: 'Monto',
        type: 'text',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'El monto es requerido',
          },
        ]
      },
    ]
  },
  company: {
    name: PARAMETERS.COMPANY,
    fields: [
      {
        name: 'code',
        label: 'Código',
        type: 'text',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'El código es requerido',
          },
        ]
      },
      {
        name: 'name',
        label: 'Nombre',
        type: 'text',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'El nombre es requerido',
          },
        ]
      },
    ]
  },
  customer: {
    name: PARAMETERS.CUSTOMER,
    fields: [
      {
        name: 'company_id',
        label: 'Empresa',
        type: 'select',
        prefix: true,
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'La empresa es requerida',
          },
        ]
      },
      {
        name: 'code',
        label: 'Código',
        type: 'text',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'El código es requerido',
          },
        ]
      },
      {
        name: 'name',
        label: 'Nombre',
        type: 'text',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'El nombre es requerido',
          },
        ]
      },
      {
        name: 'ruc',
        label: 'RUC',
        type: 'text',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'El RUC es requerido',
          },
        ]
      },
      {
        name: 'phone',
        label: 'Teléfono',
        type: 'text',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'El teléfono es requerido',
          },
        ]
      },
    ]
  },
  shift: {
    name: PARAMETERS.SHIFT,
    fields: [
      {
        name: 'name',
        label: 'Nombre',
        type: 'text',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'El nombre es requerido',
          },
        ]
      },
      {
        name: 'shortName',
        label: 'Nonbre corto',
        type: 'text',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'El nombre corto es requerido',
          },
        ]
      },
    ]
  },
  unit: {
    name: PARAMETERS.UNIT,
    fields: [
      {
        name: 'customer_id',
        label: 'Cliente',
        type: 'select',
        prefix: true,
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'El cliente es requerido',
          },
        ]
      },
      {
        name: 'code',
        label: 'Código',
        type: 'text',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'El código es requerido',
          },
        ]
      },
      {
        name: 'name',
        label: 'Nombre',
        type: 'text',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'El nombre es requerido',
          },
        ]
      },
      {
        name: 'center_id',
        label: 'Centro de costo',
        type: 'select',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'El centro de costo es requerido',
          },
        ]
      },

      {
        name: 'min_assign',
        label: 'N° trabajadores a asignar',
        type: 'text',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'El N° de trabajadores es requerido',
          },
        ]
      },
      {
        name: 'shifts',
        label: 'Turnos',
        type: 'table',
        value: '',
      },
    ]
  },
  assignment: {
    name: PARAMETERS.ASSIGNMENT,
    fields: [
      {
        name: 'unit_shift_id',
        label: 'Unidad por turno',
        type: 'select',
        value: '',
        validators: [
          {
            name: 'required',
            validator: 'required',
            message: 'La unidad por turno es requerida',
          },
        ]
      },
      {
        name: 'workers',
        label: 'Trabajadores por asignar',
        type: 'table',
      },
      {
        name: 'state',
        label: 'Activo',
        type: 'checkbox',
        value: true,
      },
    ]
  }
};
