import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalGaugeComponent } from './interval-gauge.component';

describe('IntervalGaugeComponent', () => {
  let component: IntervalGaugeComponent;
  let fixture: ComponentFixture<IntervalGaugeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntervalGaugeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntervalGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
