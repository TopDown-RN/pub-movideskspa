import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AutorizaService } from '../services/autoriza.service';

@Injectable({
  providedIn: 'root',
})
export class Guarda implements CanActivate {
  constructor(private autoriza: AutorizaService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.autoriza.verificarAuticacao()) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
