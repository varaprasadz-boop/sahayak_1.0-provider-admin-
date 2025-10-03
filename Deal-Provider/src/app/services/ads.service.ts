// ads.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdsService {
  private adsUrl = 'your_ads_api_url';

  constructor(private http: HttpClient) { }

  // Function to fetch ads data from API
  public fetchAdsData(): Observable<any[]> {
    return this.http.get<any[]>(this.adsUrl)
      .pipe(
        map((response:any) => response.ads)
      );
  }

  // Function to filter ads based on selected city's coordinates
  public filterAdsByCity(cityLat: number, cityLng: number): Observable<any[]> {
    return this.fetchAdsData()
      .pipe(
        map(ads => {
          const thresholdDistance = 50; // Threshold distance in kilometers, adjust as needed

          return ads.filter(ad => {
            const adDistance = this.calculateDistance(cityLat, cityLng, ad.latitude, ad.longitude);
            return adDistance <= thresholdDistance;
          });
        })
      );
  }

  // Function to calculate the distance between two points using latitude and longitude
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  // Function to convert degrees to radians
  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
