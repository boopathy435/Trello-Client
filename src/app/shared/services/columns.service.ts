import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ColumnInterface } from '../types/column.interface';
import { ColumnInputInterface } from '../types/columnInput.interface';
import { SocketService } from './socket.service';
import { SocketEventsEnum } from '../types/socketEvents.enum';

@Injectable({
  providedIn: 'root',
})
export class ColumnsService {
  constructor(private http: HttpClient, private socketService: SocketService) {}
  getColumns(boardId: string): Observable<ColumnInterface[]> {
    const url = `${environment.apiUrl}/boards/${boardId}/columns`;
    return this.http.get<ColumnInterface[]>(url);
  }

  createColumn(columnInput: ColumnInputInterface) {
    this.socketService.emit(SocketEventsEnum.columnsCreate, columnInput);
  }

  deleteColumn(boardId: string, columnId: string) {
    this.socketService.emit(SocketEventsEnum.columnsDelete, {boardId,columnId});
  }

  updateColumn(boardId: string, columnId: string, fields: {title: string}) {
    this.socketService.emit(SocketEventsEnum.columnsUpdate, {boardId,columnId,fields});
  }
}
