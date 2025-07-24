import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggingEffortsListComponent } from './logging-efforts-list.component';

describe('LoggingEffortsListComponent', () => {
  let component: LoggingEffortsListComponent;
  let fixture: ComponentFixture<LoggingEffortsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggingEffortsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoggingEffortsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
