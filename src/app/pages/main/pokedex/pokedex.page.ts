import { Component, OnDestroy,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { PokeapiService } from '../../../services/pokeapi.service';
import { Pokemon, examplePokemon } from '../../../models/pokemon.model';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.page.html',
  styleUrls: ['./pokedex.page.scss'],
  standalone: true,
  imports: [
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonContent,
    CommonModule,
    FormsModule,
    HeaderComponent,
  ],
})
export class PokedexPage implements OnInit {
  selectedPokemon?: Pokemon = examplePokemon;
  showDetails: boolean = false;
  showStats: boolean = true;

  constructor() { }

  ngOnInit() {
    this.selectedPokemon = examplePokemon;
  }


  setPokemon(pokemon: Pokemon) {
    this.selectedPokemon = pokemon;

  }

  search(event: any) {
    let namePoke = event.target.value;
    console.log(namePoke);
  }

}
