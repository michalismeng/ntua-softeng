import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment as env } from '../environments/environment';
import { Point } from 'src/models/point';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class GeocodeService{

    public mapClickedSubject = new Subject<Point>();

    constructor(private http: HttpClient){}

    public geocode(address: string): Observable<Point[]> {
        let params = new HttpParams().set('key', env.geocodeKey)
                                     .set("location",address)
                                     .set('outFormat', "json")

        return this.http.get(env.geocodeURL, { params: params })
                        .pipe(map((res:any) => res.results[0].locations.map(l => this.mapLocations(l))))
    }
   
    public reverseGeocode(point: Point): Observable<any> {
        let params = new HttpParams().set('key', env.geocodeKey)
                                     .set("location", point.lat + ',' + point.lon)
                                     .set('outFormat', "json")

                        
        return this.http.get(env.revGeocodeURL, { params: params }) 
                        .pipe(map((res:any) => res.results[0].locations.map(l => this.mapAddress(l))))
    }

    private mapLocations(location: any): Point {
        return new Point(location.latLng.lng, location.latLng.lat)
    }

    public mapAddress(location: any): string{
        // console.log(location);   // TODO: add more fields to street
        return location.street;
    }

    public mapClicked(): Observable<Point> {
        return this.mapClickedSubject.asObservable();
    }
}