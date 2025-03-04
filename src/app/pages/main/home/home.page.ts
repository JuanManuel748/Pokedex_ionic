import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  IonContent,
  IonFab,
  IonIcon,
  IonFabButton,
  IonLabel,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonItem,
  IonAvatar,
  IonList,
  IonSkeletonText,
  IonRefresher,
  IonRefresherContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, createOutline, trashOutline, bodyOutline } from 'ionicons/icons';
import { Miniature } from 'src/app/models/miniature.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { QueryOptions } from 'src/app/services/query-options.interface';
import {ownedPokemon, Party} from 'src/app/models/pokemon.model';
import {AddUpdatePokemonComponent} from "../../../shared/components/add-update-pokemon/add-update-pokemon.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonRefresherContent,
    IonRefresher,
    IonSkeletonText,
    IonList,
    IonAvatar,
    IonItem,
    IonItemSliding,
    IonItemOption,
    IonLabel,
    IonFabButton,
    IonIcon,
    IonFab,
    HeaderComponent,
    IonContent,
    CommonModule,
  ],
})
export class HomePage implements OnInit {
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  supabaseService = inject(SupabaseService);
  miniatures: Miniature[] = [];
  loading: boolean = false;
  pokemons: ownedPokemon[] = [];


  constructor() {
    addIcons({ createOutline, trashOutline, bodyOutline, add });
  }

  ngOnInit() {
    this.getPokemons();
  }

  getPokemons() {
    this.loading = true;
    const user: User = this.utilsService.getLocalStoredUser()!;
    const path: string = `users/${user.uid}/pokemons`;
    const queryOptions: QueryOptions = {
      orderBy: { field: 'idPoke', direction: 'asc' },
    }

    let timer: any;

    const resetTimer = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        sub.unsubscribe();

      }, 5000)
    };

    let sub = this.firebaseService.getCollectionData(path, queryOptions).subscribe({
      next: (res: any) => {
        this.pokemons = res;
        this.loading = false;
        resetTimer();
      },
    });


  }

  async addUpdatePokemon(Inputpokemon?: ownedPokemon) {
    let success = await this.utilsService.presentModal({
      component: AddUpdatePokemonComponent,
      cssClass: 'add-update-modal',
      componentProps: { Inputpokemon },
    });
    if (success) {
      this.getPokemons();
    }
  }

  async deletePokemon(pokemon: ownedPokemon) {
    const loading = await this.utilsService.loading();
    await loading.present();
    const user: User = this.utilsService.getLocalStoredUser()!;
    await this.firebaseService.deletePokemon(user.uid, pokemon.id!.toString());
    this.pokemons = this.pokemons.filter(p => p.id !== pokemon.id);
    loading.dismiss();
  }

  async confirmDeletePokemon(pokemon: ownedPokemon) {
    this.utilsService.presentAlert({
      header: 'Eliminar Pokémon',
      message: '¿Está seguro de que desea eliminar el Pokémon?',
      mode: 'ios',
      buttons: [
        { text: 'No' },
        { text: 'Sí', handler: () => this.deletePokemon(pokemon) },
      ],
    });
  }



  doRefresh(event: any) {
    setTimeout(() => {
      this.getPokemons();
      event.target.complete();
    }, 2000);
  }

  getPokemonImage(pokemonId: string, isShiny: boolean = false): string {
    const shinySuffix = isShiny ? 'shiny/' : '';
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shinySuffix}${pokemonId}.png`;
  }
}
