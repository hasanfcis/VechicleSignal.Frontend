import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { promise } from "protractor";



interface IServiceResponse {
    results: any[];
    
}

@Injectable()
export class DataService {
    private rndUsr: any[];

    constructor(private http: HttpClient) {
    }

    /** GET vehicles from the server */
  public GetVehicles (): Observable<any[]> {
    return this.http.get<any[]>("api/Vehicle/GetVehicles")
  }

    public getData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get("api/Vehicle/GetVehicles")
                .subscribe((data: IServiceResponse) => {
                    resolve(data.results);
                });
        });
    }
}
