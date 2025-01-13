import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { CurrentUserInterface } from '../../auth/types/currentUser.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  socket: Socket | undefined;
  setSocketConnection(currentUser: CurrentUserInterface) {
    this.socket = io(environment.socketUrl, {
      auth: {
        token: currentUser.token,
      },
    });
  }

  disconnect() {
    if (!this.socket) {
      throw new Error('Socket connection is not established');
    }
    this.socket.disconnect();
  }

  emit(eventName: string, message: any){
    if (!this.socket) {
        throw new Error('Socket connection is not established');
      }
      this.socket.emit(eventName,message);
  }

  listen<T>(eventName: string): Observable<T>{
    const socket = this.socket;
    if(!socket){
      throw new Error("Socket connection is not established");
    }

    return new Observable((subscriber)=>{
      socket.on(eventName, (data)=>{
        subscriber.next(data);
      })
    })
  }
}
