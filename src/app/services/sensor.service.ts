import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  constructor() {}

  async getCurrentCoordinates() {
    const coordinates = await Geolocation.getCurrentPosition({enableHighAccuracy: true});
    return coordinates;
  }
}
