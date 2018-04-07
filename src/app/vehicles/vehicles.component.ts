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
// import { athletesData } from "./Services/data";
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

  get hideAthleteNumber() {
    return this.windowWidth && this.windowWidth < 960;
  }
  get hideBeatsPerMinute() {
    return this.windowWidth && this.windowWidth < 860;
  }

  constructor(private zone: NgZone, private dataService: DataService) { }

  public ngOnInit() {
    // this.localData = athletesData;
    this.dataService.getData().then((json: any) => {
        let idx = 0;
        const data = [];

        for (const i of data) {
          i.Id = json[idx].Id;
          i.CustomerName = json[idx].CustomerName;
          i.StatusName = json[idx].StatusName;
          i.VehicleIdentifier=json[idx].VehicleIdentifier;
          i.RegisterNumber=json[idx].RegisterNumber;
          i.LastSignalTime=json[idx].LastSignalTime;
          i.Status=json[idx].StatusId;
          idx++;
          data.push(i);
        }

        this.localData = data;
      });

    this.windowWidth = window.innerWidth;
    this._timer = setInterval(() => this.ticker(), 3000);
  }


  public ngOnDestroy() {
    clearInterval(this._timer);
  }

  public isTop3(cell): boolean {
    const top = cell.value > 0 && cell.value < 4;
    if (top) {
      cell.row.nativeElement.classList.add("top3");
    } else {
      cell.row.nativeElement.classList.remove("top3");
    }
    return top;
  }

  public getIconType(cell) {
    switch (cell.row.rowData.Position) {
      case "up":
        return "arrow_upward";
      case "current":
        return "arrow_forward";
      case "down":
        return "arrow_downward";
    }
  }

  // public getBadgeType(cell) {
  //   switch (cell.row.rowData.Position) {
  //     case "up":
  //       return "success";
  //     case "current":
  //       return "warning";
  //     case "down":
  //       return "error";
  //   }
  // }

  @HostListener("window:resize", ["$event"])
  public onResize(event) {
    this.windowWidth = event.target.innerWidth;
  }

  public customerFilter(term) {
    this.vehicleGrid.filter("CustomerName", term, STRING_FILTERS.contains);
  }

  public statusFilter(term) {
    this.vehicleGrid.filter("StatusName", term, STRING_FILTERS.startsWith);
  }

  private ticker() {
    this.zone.runOutsideAngular(() => {
      this.updateData();
      this.zone.run(() => this.vehicleGrid.markForCheck());
    });
  }

  private generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private updateData() {
   // alert('updated');
    // this.localData.map((rec) => {
    //   let val = this.generateRandomNumber(-1, 1);
    //   switch (val) {
    //     case -1:
    //       rec.Position = "down";
    //       val = 0;
    //       break;
    //     case 0:
    //       rec.Position = "current";
    //       val = 1;
    //       break;
    //     case 1:
    //       rec.Position = "up";
    //       val = 3;
    //       break;
    //   }
    //   rec.TrackProgress += val;
    // });

    // this.localData.sort((a, b) => b.TrackProgress - a.TrackProgress).map((rec, idx) => rec.Id = idx + 1);
    // this.localData = this.localData.slice(0);

    // if (this.localData[0].TrackProgress >= 100) {
    //   this.live = false;
    //   this.isFinished = true;
    // }
  }
}
