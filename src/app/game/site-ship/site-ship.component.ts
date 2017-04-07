import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'site-ship',
  templateUrl: './site-ship.component.html',
  styleUrls: ['./site-ship.component.css']
})
export class SiteShipComponent implements OnInit {
  // either 'vertical' or 'horizontal'
  @Input() orientation: string;

  constructor() { }

  ngOnInit() {

  }

}
