import {
  AfterViewInit,
  Component,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";

import { IgxGridComponent } from "igniteui-angular/grid/grid.component";
import { STRING_FILTERS } from "igniteui-angular/main";
import { DataService } from "./Services/data.service";
import { athletesData } from "./Services/data";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit, OnDestroy {

  @ViewChild("vehicleGrid", { read: IgxGridComponent })
  public vehicleGrid: IgxGridComponent;


  public localData: any[];
  public isFinished = false;
  private _live = true;
  private _timer;
  private windowWidth: any;

  get live() {
    return this._live;
  }

  set live(val) {
    this._live = val;
    if (this._live) {
      this._timer = setInterval(() => this.ticker(), 3000);
    } else {
      clearInterval(this._timer);
    }
  }

  constructor(private zone: NgZone, private dataService: DataService) { }

  public ngOnInit() {
    this.dataService.GetVehicles().subscribe((json: any[]) => {
      this.localData = json;
    });

    this.windowWidth = window.innerWidth;
    this._timer = setInterval(() => this.ticker(), 3000);
  }

  public ngOnDestroy() {
    clearInterval(this._timer);
  }

  @HostListener("window:resize", ["$event"])
  public onResize(event) {
    this.windowWidth = event.target.innerWidth;
  }

  public customerFilter(term) {
    this.vehicleGrid.filter("customerName", term, STRING_FILTERS.contains);
  }

  public statusFilter(term) {
    this.vehicleGrid.filter("statusName", term, STRING_FILTERS.startsWith);
  }

  private ticker() {
    this.zone.runOutsideAngular(() => {
      this.populateGrid();
      this.zone.run(() => this.vehicleGrid.markForCheck());
    });
  }

  private generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private populateGrid() {

    this.dataService.GetVehicles().subscribe((json: any[]) => {
      this.localData = json;
    });
  }
}
