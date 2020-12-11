import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChordsBoxComponent } from './chords-box.component';

describe('ChordsBoxComponent', () => {
  let component: ChordsBoxComponent;
  let fixture: ComponentFixture<ChordsBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChordsBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChordsBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
