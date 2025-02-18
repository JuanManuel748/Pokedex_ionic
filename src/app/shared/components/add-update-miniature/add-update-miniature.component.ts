import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {IonContent, IonIcon, IonHeader, IonToolbar, IonFabButton, IonFab } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { CustomInputComponent } from 'src/app/shared/components/custom-input/custom-input.component';
import { addIcons } from 'ionicons';
import { lockClosedOutline, mailOutline, personAddOutline, personOutline, alertCircleOutline } from 'ionicons/icons';
import { IonButton } from '@ionic/angular/standalone';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './add-update-miniature.component.html',
  styleUrls: ['./add-update-miniature.component.scss'],
  standalone: true,
  imports: [IonFabButton, IonIcon, IonFab, IonButton, HeaderComponent, IonContent],
})
export class AddUpdateMiniatureComponent implements OnInit {
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    units: new FormControl('', [Validators.required, Validators.min(1)]),
    strength: new FormControl('', [Validators.required, Validators.min(0)]),
  });

  constructor() {
    addIcons({
      mailOutline,
      lockClosedOutline,
      personAddOutline,
      personOutline,
      alertCircleOutline,
    });
  }
  ngOnInit() {}


  async signOut() {
    this.firebaseService.signOut().then(() => {
      this.utilsService.routerLink('/auth');
    });
  }
  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();
      this.firebaseService
        .signUp(this.form.value as User)
        .then(async (res) => {
          this.firebaseService.updateUser(this.form.value.name!);
          let uid = res.user!.uid;
        })
        .catch((error) => {
          this.utilsService.presentToast({
            message: error.message,
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  addUpdateMiniature() {
    this.utilsService.presentModal({ component: AddUpdateMiniatureComponent, cssClass: "add-update-modal"})
  }
}
