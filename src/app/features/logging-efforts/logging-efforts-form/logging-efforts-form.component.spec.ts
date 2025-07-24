import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggingEffortsFormComponent } from './logging-efforts-form.component';

describe('LoggingEffortsFormComponent', () => {
  let component: LoggingEffortsFormComponent;
  let fixture: ComponentFixture<LoggingEffortsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggingEffortsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoggingEffortsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
