import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(
    private nativeStorage: NativeStorage
  ) { }

  setStorange(settingName,value){
    return this.nativeStorage.setItem(`setting:${ settingName }`, {property: value});
  }

  async getStorange(settingName){
    return await this.nativeStorage.getItem(`setting:${ settingName }`);
  }

  async removeStorange(settingName){
    return await this.nativeStorage.remove(`setting:${ settingName }`);
  }
  
  clearStorange() {
    this.nativeStorage.clear().then(() => {
      console.log('Data storage limpiado');
    });
  }
}
