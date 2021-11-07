import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';
import { ActivatedRoute } from '@angular/router';

interface BrosisUpdate {
  readonly updateName: string;
  readonly bro: number;
  readonly sis: number;
  readonly name: string;
  readonly date: string;
}

interface BrosisMessage {
  username: string;
}

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  providers: [
    CookieService,
  ],
})
export class AppComponent {
  brosis!: BrosisUpdate;

  constructor(
    private readonly socket: Socket,
    private readonly cookieService: CookieService,
  ) {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    if (urlParams.get('username')) {
      this.cookieService.set('username', urlParams.get('username')!);
    }

    this.socket.fromEvent('connect_error').subscribe(() => console.log('connnect error'));
    this.socket.fromEvent('connect').subscribe(() => console.log('connect'));
    this.socket.fromEvent<BrosisUpdate>('brosis').subscribe(update => {
      this.brosis = update;
      console.log('brosis: ', this.brosis);
    });
  }

  readonly googleAuthUrl = `${environment.serverUrl}/google`;

  get loginData(): BrosisMessage {
    return {
      username: this.cookieService.get('username'),
    };
  }

  logout() {
    this.cookieService.delete('username');
  }

  sendAction(action: string) {
    this.socket.emit('action', {
      ...this.loginData,
      action,
    });
  }
}
