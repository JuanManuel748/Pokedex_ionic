import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonContent, IonAvatar, IonButton, IonIcon, IonInput} from '@ionic/angular/standalone';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import { User } from 'src/app/models/user.model';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { addIcons } from 'ionicons';
import { cameraOutline, personOutline, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonAvatar, IonContent, CommonModule, FormsModule, HeaderComponent, IonInput]
})
export class ProfilePage implements OnInit {
  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  supabaseService = inject(SupabaseService);
  user : User;
  constructor() {
    this.user = this.utilsService.getLocalStorageUser();
    addIcons({personCircleOutline,cameraOutline,personOutline});
  }

  ngOnInit() {

  }


  async takeImage() {
    let loading;
    try {
      const image = await this.utilsService.takePicture("Imagen de perfil");
      if (!image || !image.dataUrl) {
        console.log("No se pudo obtener la imagen.");
        return;
      }

      loading = await this.utilsService.loading();
      await loading.present();
      if (this.user.image) {
        const oldImagePath = this.supabaseService.getFilePath(this.user.image);
        await this.supabaseService.deleteFile(oldImagePath!);
      }
      const imagePath = `users/${this.user.uid}/profile${Date.now()}`;
      const imageUrl = await this.supabaseService.uploadImage(imagePath, image.dataUrl);
      if (!imageUrl) {
        console.log("No se pudo subir la imagen a Supabase.");
        return;
      }

      this.user.image = imageUrl;
      const path = `users/${this.user.uid}`;
      await this.firebaseService.updateDocument(path, { image: this.user.image });
      this.utilsService.saveInLocalStorage('user', this.user);
      await this.utilsService.presentToast({
        color: "success",
        duration: 1500,
        message: "Foto de perfil actualizada exitosamente",
        position: "middle",
        icon: 'checkmark-circle-outline'
      });
    } catch (error: any) {
      console.error("Error al actualizar la imagen de perfil:", error);
      await this.utilsService.presentToast({
        color: "danger",
        duration: 2500,
        message: error.message,
        position: "middle",
        icon: 'alert-circle-outline'
      });
    } finally {
      if (loading) {
        await loading.dismiss();
      }
    }
  }

  save($event: MouseEvent) {
    if (!this.user) {console.log("No hay ningun usuario logeado"); return;}
    this.firebaseService.updateUser(this.user.name);
    const path: string = `users/${this.user.uid}`;
    this.firebaseService.updateDocument(path, { name: this.user.name })
      .then(async (res) => {
        this.utilsService.saveInLocalStorage('user', this.user);
        await this.utilsService.presentToast({
          message: 'Nombre actualizado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch((error) => {
        this.utilsService.presentToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      });
  }
}
