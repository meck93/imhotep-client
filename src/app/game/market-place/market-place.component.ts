import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'market-place',
  templateUrl: './market-place.component.html',
  styleUrls: ['./market-place.component.css']
})
export class MarketPlaceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  displayRule():void{
    // displays the rules popup
    var popup = document.getElementById("marketPlacePopup");
    popup.classList.toggle("show");
  }

}
