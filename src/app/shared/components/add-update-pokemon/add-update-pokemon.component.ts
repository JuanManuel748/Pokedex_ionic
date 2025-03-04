import { Component, inject, Input, OnInit } from '@angular/core';
import { ownedPokemon, Pokemon } from "../../../models/pokemon.model";
import { FirebaseService } from "../../../services/firebase.service";
import { SupabaseService } from "../../../services/supabase.service";
import { UtilsService } from "../../../services/utils.service";
import { User } from "../../../models/user.model";
import { HeaderComponent } from "../header/header.component";
import { IonButton, IonContent, IonIcon } from "@ionic/angular/standalone";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { PokeapiService } from "../../../services/pokeapi.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-add-update-party',
  templateUrl: './add-update-pokemon.component.html',
  styleUrls: ['./add-update-pokemon.component.scss'],
  imports: [
    HeaderComponent,
    IonButton,
    IonContent,
    IonIcon,
    ReactiveFormsModule,
    FormsModule,
    NgIf
  ]
})
export class AddUpdatePokemonComponent implements OnInit {
  @Input() Inputpokemon: ownedPokemon | null = null;
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  currentPokemon: ownedPokemon = {} as ownedPokemon;

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    idPoke: new FormControl('', [Validators.required]),
    shiny: new FormControl('', [Validators.required]),
  });

  user = {} as User;
  searchInput: any;

  constructor(private pokeapi: PokeapiService) { }

  ngOnInit() {
    this.currentPokemon.idPoke = "1";
    this.user = this.utilsService.getFromLocalStorage('user');
    if (this.Inputpokemon) {
      this.setPokemon(this.Inputpokemon)
    }
  }

  setPokemon(pokemon: ownedPokemon) {
    // Implementar lógica para establecer el Pokémon actual
    this.currentPokemon = pokemon;
    this.currentPokemon.idPoke = pokemon.idPoke;
    this.currentPokemon.name = pokemon.name;
    this.currentPokemon.shiny = pokemon.shiny;
    console.log("ID: " + this.currentPokemon.idPoke);
    console.log("Name: " + this.currentPokemon.name);
    console.log("Shiny: " + this.currentPokemon.shiny);

  }


  async submit() {
    if (this.validate()) {
      if (this.Inputpokemon) {
        console.log("Update");
        await this.updatePokemon();
      } else {
        console.log("Create");
        await this.createPokemon();
      }
    } else {
      console.log("Error al validar");
    }
  }

  async previousPokemon(event: any) {
    this.currentPokemon.idPoke = (parseInt(this.currentPokemon.idPoke) - 1).toString();
  }

  async nextPokemon(event: any) {
    this.currentPokemon.idPoke = (parseInt(this.currentPokemon.idPoke) + 1).toString();
  }

  async search(event: any) {
    let searchText: string = this.searchInput.toString();
    let poke: Pokemon = await this.pokeapi.getById(searchText);
    let owned: ownedPokemon = {
      id: 0,
      idPoke: poke.id.toString(),
      name: poke.name,
      shiny: false
    };
    this.setPokemon(owned);
  }

  validate(): boolean {
    return true;
  }



  async createPokemon() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const path: string = `users/${this.user.uid}/pokemons`;

    // Eliminar la propiedad id antes de guardar el documento
    const { id, ...pokemonData } = this.currentPokemon;

    this.firebaseService
      .addDocument(path, pokemonData)
      .then(async (res) => {
        console.log('Pokemon añadido correctamente:', res);
        await this.utilsService.dismissModal({ success: true });
        await this.utilsService.presentToast({
          message: 'Pokemon añadido exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch((error) => {
        console.log('Error al añadir el Pokemon:', error);
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

  async updatePokemon() {
    // Implementar lógica para actualizar el equipo existente
  }



  getPokemonImage(pokemonId: string, isShiny: boolean = false): string {
    const shinySuffix = isShiny ? 'shiny/' : '';
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shinySuffix}${pokemonId}.png`;
  }
}
