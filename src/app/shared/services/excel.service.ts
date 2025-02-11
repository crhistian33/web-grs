import { Injectable } from '@angular/core';
import { Worker, WorkerUpload } from '@models/worker.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  processFile(file: File): Observable<WorkerUpload[]> {
    return this.readExcelFile(file).pipe(
      map(data => this.validateData(data)),
      catchError((error) => throwError(() =>
        new Error(error.message || 'Error al procesar el archivo Excel')
      ))
    );
  }

  private readExcelFile(file: File): Observable<WorkerUpload[]> {
    return new Observable(subscriber => {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const binary = e.target?.result;
          const workbook = XLSX.read(binary, { type: 'binary' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(firstSheet) as WorkerUpload[];

          subscriber.next(data);
          subscriber.complete();
        } catch (error) {
          subscriber.error(new Error('Error al procesar el archivo Excel'));
        }
      };

      reader.onerror = () => {
        subscriber.error(new Error('Error al leer el archivo'));
      };

      reader.readAsArrayBuffer(file);

      // Cleanup
      return () => {
        reader.abort();
      };
    });
  }

  private validateData(data: WorkerUpload[]): WorkerUpload[] {
    if (!data.length) {
      throw new Error('El archivo no contiene datos');
    }

    const errors: string[] = [];

    data.forEach((row, index) => {
      const rowErrors: string[] = [];

      if (!row.name || !row.dni || !row.company_id ||
          !row.type_worker_id || !row.user_id) {
        rowErrors.push('Contiene datos incompletos');
      }

      if (!/^\d{8}$/.test(row.dni)) {
        rowErrors.push(`DNI inválido (${row.dni})`);
      }

      if (rowErrors.length) {
        errors.push(`Fila ${index + 1}: ${rowErrors.join(', ')}`);
      }
    });

    if (errors.length) {
      throw new Error(errors.join('\n'));
    }

    return data;
  }
}
