import { Observable } from 'rxjs';

export interface CanDeactivateInterface {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
