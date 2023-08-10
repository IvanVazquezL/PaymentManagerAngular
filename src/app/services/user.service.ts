import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user!: User;

  constructor(
    private http: HttpClient
  ) { }

  saveLocalStorage(token: string) {
    localStorage.setItem('token', token );
  }

  login( formData: LoginForm ) {
    return this.http.post(`${ base_url }/login`, formData )
                .pipe(
                  tap( (resp: any) => {
                    this.saveLocalStorage(resp.token);
                    this.user = new User(resp.user.username, '', resp.user.uid);
                    console.log(JSON.stringify(resp));
                    console.log(JSON.stringify(this.user));

                  })
                );
  }
}
