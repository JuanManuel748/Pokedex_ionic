import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { homeOutline, personOutline, logOutOutline, personCircleOutline, hardwareChipOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MainPage implements OnInit {
  router = inject(Router);
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  pages = [
    {
      title: 'Inicio',
      url: '/main/home',
      icon: 'home-outline',
    },
    {
      title: 'Perfil',
      url: '/main/profile',
      icon: 'person-outline',
    },
    {
      title: 'Sensores',
      url: '/main/sensors',
      icon: 'hardware-chip-outline',
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
