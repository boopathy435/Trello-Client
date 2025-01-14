import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SocketService } from '../../shared/services/socket.service';
import { BoardInterface } from '../../shared/types/board.interface';
import { ColumnInterface } from '../../shared/types/column.interface';
import { SocketEventsEnum } from '../../shared/types/socketEvents.enum';
import { TaskInterface } from '../../shared/types/task.interface';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  board$ = new BehaviorSubject<BoardInterface | null>(null);
  columns$ = new BehaviorSubject<ColumnInterface[]>([]);
  tasks$ = new BehaviorSubject<TaskInterface[]>([]);

  constructor(private socketService: SocketService) {}

  setBoard(board: BoardInterface) {
    this.board$.next(board);
  }

  leaveBoard(boardId: string) {
    this.board$.next(null);
    this.socketService.emit(SocketEventsEnum.boardsLeave, { boardId });
  }

  setColumns(columns: ColumnInterface[]) {
    this.columns$.next(columns);
  }

  addColumn(column: ColumnInterface) {
    const columns = [...this.columns$.getValue(), column];
    console.log('columns:',columns);
    
    this.columns$.next(columns);
  }

  setTasks(tasks: TaskInterface[]) {
    this.tasks$.next(tasks);
  }

  addTask(task: TaskInterface) {
    const tasks = [...this.tasks$.getValue(), task];
    this.tasks$.next(tasks);
  }

  updateBoard(updatedBoard: BoardInterface) {
    const board = this.board$.getValue();
    if (!board) {
      throw new Error('Board is not initialized');
    }

    this.board$.next({ ...board, title: updatedBoard.title });
  }

  deleteColumn(columnId: string){
    const updatedColumn = this.columns$.getValue().filter(each=>each.id!==columnId);
    this,this.columns$.next(updatedColumn);
  }
}
