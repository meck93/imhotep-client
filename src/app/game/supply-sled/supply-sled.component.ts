import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'supply-sled',
  templateUrl: './supply-sled.component.html',
  styleUrls: ['./supply-sled.component.css']
})
export class SupplySledComponent implements OnInit {// input variable for component
  @Input() color: String = '';

  constructor() {

  }

  ngOnInit() {
  }

  getStones() {

  }
}
