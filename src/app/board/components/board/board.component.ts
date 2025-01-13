import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { BoardsService } from '../../../shared/services/boards.service';
import { ColumnsService } from '../../../shared/services/columns.service';
import { SocketService } from '../../../shared/services/socket.service';
import { TasksService } from '../../../shared/services/tasks.service';
import { BoardInterface } from '../../../shared/types/board.interface';
import { ColumnInterface } from '../../../shared/types/column.interface';
import { ColumnInputInterface } from '../../../shared/types/columnInput.interface';
import { SocketEventsEnum } from '../../../shared/types/socketEvents.enum';
import { TaskInterface } from '../../../shared/types/task.interface';
import { BoardService } from '../../services/board.service';
import { TaskInputInterface } from '../../../shared/types/taskInput.interface';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  boardId!: string;
  data$: Observable<{
    board: BoardInterface;
    columns: ColumnInterface[];
    tasks: TaskInterface[];
  }>;
  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private socketService: SocketService,
    private columnsService: ColumnsService,
    private tasksService: TasksService
  ) {
    const boardId = this.route.snapshot.paramMap.get('boardId');

    if (!boardId) {
      throw new Error("Can't get board id from url");
    }

    this.boardId = boardId;
    this.data$ = combineLatest([
      this.boardService.board$.pipe(filter(Boolean)),
      this.boardService.columns$,
      this.boardService.tasks$,
    ]).pipe(map(([board, columns, tasks]) => ({ board, columns, tasks })));
  }

  ngOnInit(): void {
    this.socketService.emit(SocketEventsEnum.boardsJoin, {
      boardId: this.boardId,
    });
    this.fetchData();
    this.initializeListeners();
  }

  initializeListeners() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.boardService.leaveBoard(this.boardId);
      }
    });

    this.socketService
      .listen<ColumnInterface>(SocketEventsEnum.columnsCreateSuccess)
      .subscribe((column: ColumnInterface) => {
        this.boardService.addColumn(column);
      });

    this.socketService
      .listen<TaskInterface>(SocketEventsEnum.tasksCreateSuccess)
      .subscribe((task: TaskInterface) => {
        this.boardService.addTask(task);
      });

      this.socketService
      .listen<BoardInterface>(SocketEventsEnum.boardsUpdateSuccess)
      .subscribe((updatedBoard) => {
        this.boardService.updateBoard(updatedBoard);
      });
  }

  fetchData() {
    this.boardsService.getBoard(this.boardId).subscribe((res) => {
      this.boardService.setBoard(res);
    });
    this.columnsService.getColumns(this.boardId).subscribe((columns) => {
      this.boardService.setColumns(columns);
    });
    this.tasksService.getTasks(this.boardId).subscribe((tasks) => {
      this.boardService.setTasks(tasks);
    });
  }

  createColumn(title: string) {
    const columnInput: ColumnInputInterface = {
      title,
      boardId: this.boardId,
    };

    this.columnsService.createColumn(columnInput);
  }

  createTask(title: string, columnId: string) {
    const taskInput: TaskInputInterface = {
      title,
      boardId: this.boardId,
      columnId,
    };

    this.tasksService.createTask(taskInput);
  }

  getTasksByColumn(columnId: string, tasks: TaskInterface[]): TaskInterface[] {
    return tasks.filter((task) => task.columnId === columnId);
  }

  updateBoardName(boardName: string) {
    this.boardsService.updateBoard(this.boardId, { title: boardName });
  }

  test() {
    this.socketService.emit(SocketEventsEnum.columnsCreate, {
      boardId: this.boardId,
      title: 'foo',
    });
  }
}
