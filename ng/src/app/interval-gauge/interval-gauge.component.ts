import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'gab-interval-gauge',
  template: `
  <svg viewbox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <path stroke="#000" d="M 42,24 V 42 H 22 V 24 a 10,10 0 0 1 20,0 z" />
    <rect stroke="#000" y="42" x="19" width="26" rx="2" height="6" fill="#39180e" />
    <path d="m 26,24 h -2 a 8.009,8.009 0 0 1 8,-8 v 2 a 6.006,6.006 0 0 0 -6,6 z" />
    <rect y="42" x="21" width="9" rx="1" height="2" />
  </svg>
  `,
  styles: [
  ]
})
export class IntervalGaugeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
