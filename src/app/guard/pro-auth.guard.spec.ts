import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { proAuthGuard } from './pro-auth.guard';

describe('proAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => proAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
