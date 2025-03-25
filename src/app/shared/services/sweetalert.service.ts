import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetalertService {
  confirmSuccess(title: string, message: string, success?: any) {
    Swal.fire({
      title: `${title}`,
      text: `${message}`,
      icon: "success",
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        title: 'swal-title'
      },
    }).then(() => {
      if(success) success()
    })
  }

  openWarning(title: string, message: string, success?: any) {
    Swal.fire({
      title: `${title}`,
      text: `${message}`,
      icon: "warning",
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        title: 'swal-title'
      },
    }).then(() => {
      if(success) success()
    })
  }

  confirmRemoveOrDelete(model: string, message: string, confirm: any, cancel: any) {
    Swal.fire({
      title: `¿Eliminar ${model}?`,
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
      cancelButtonText: `Remover a papelera`,
      confirmButtonColor: '#BB2124',
      showCloseButton: true,
      allowOutsideClick: false,
      reverseButtons: true,
      customClass: {
        title: 'swal-title'
      },
    }).then((result) => {
      if(result.isConfirmed) {
        confirm()
      } else {
        if(result.dismiss?.toString() === 'cancel') {
          cancel()
        }
      }
    });
  }

  confirmDelete(model: string, message: string, confirm: any) {
    Swal.fire({
      title: `¿Eliminar ${model}?`,
      text: message,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: `Eliminar`,
      confirmButtonColor: '#BB2124',
      showCloseButton: true,
      allowOutsideClick: false,
      //reverseButtons: true,
      customClass: {
        title: 'swal-title'
      },
    }).then((result) => {
      if(result.isConfirmed) {
        confirm()
      }
    });
  }

  confirmRestore(model: string, message: string, success: any) {
    Swal.fire({
      title: `¿Restaurar ${model}?`,
      text: message,
      icon: "info",
      confirmButtonText: `Aceptar`,
      confirmButtonColor: '#1d70b6',
      showCloseButton: true,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      customClass: {
        title: 'swal-title'
      },
    }).then((result) => {
      if(result.isConfirmed)
        success()
    })
  }

  confirmAction(title: string, message: string, confirmText: string, confirm: any, cancel?: any) {
    Swal.fire({
      title: title,
      text: message,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: confirmText,
      confirmButtonColor: '#BB2124',
      showCloseButton: true,
      allowOutsideClick: false,
      customClass: {
        title: 'swal-title'
      },
    }).then((result) => {
      if(result.isConfirmed) {
        confirm()
      } else {
        if(result.dismiss?.toString() === 'cancel') {
          cancel()
        }
      }
    });
  }
}
