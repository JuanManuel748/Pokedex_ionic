import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  IonContent,
  IonMenu,
  IonMenuToggle, IonLabel, IonItem, IonIcon, IonRouterOutlet, IonFooter, IonAvatar } from '@ionic/angular/standalone';
import { homeOutline, personOutline, logOutOutline, personCircleOutline, hardwareChipOutline } from 'ionicons/icons';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [IonAvatar, IonFooter, IonRouterOutlet, IonIcon, IonItem, IonLabel,
    IonContent,
    CommonModule,
    FormsModule,
    IonMenu,
    IonMenuToggle,
    RouterLink, RouterLinkActive, HeaderComponent],
})
export class MainPage implements OnInit {
  router = inject(Router);
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  pages = [
    {
      title: 'Inicio',
      url: '/main/home',
      png: 'assets/img/home.png',
    },
    {
      title: 'Perfil',
      url: '/main/profile',
      png: 'assets/img/user.png'
    },
  ];

  user: User;

  constructor() {
    addIcons({personCircleOutline,logOutOutline,personOutline,homeOutline, hardwareChipOutline});
    this.user = this.utilsService.getLocalStoredUser()!;
  }

  ngOnInit() {  }

  signOut() {
    this.firebaseService.signOut().then(() => {this.utilsService.routerLink("/auth");
    });
  }
}
