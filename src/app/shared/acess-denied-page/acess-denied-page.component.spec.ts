import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcessDeniedPageComponent } from './acess-denied-page.component';

describe('AcessDeniedPageComponent', () => {
  let component: AcessDeniedPageComponent;
  let fixture: ComponentFixture<AcessDeniedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcessDeniedPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcessDeniedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
