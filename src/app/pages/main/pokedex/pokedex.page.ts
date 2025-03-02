import { Component, OnDestroy,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { PokeapiService } from '../../../services/pokeapi.service';
import {Pokemon, examplePokemon, emptyPokemon} from '../../../models/pokemon.model';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.page.html',
  styleUrls: ['./pokedex.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    HeaderComponent,
  ],
})
export class PokedexPage implements OnInit {
  selectedPokemon?: Pokemon;
  showDetails: boolean = true;
  showStats: boolean = false;
  searchInput: any;
  buttonText: string = "Ver estadísticas";


  constructor(private pokeapi: PokeapiService) { }

  async ngOnInit() {
    this.setPokemon(await this.pokeapi.getById('1'));
  }

  async search(event: any) {
    let searchText: string = this.searchInput.toString();
    let poke: Promise<Pokemon> = this.pokeapi.getById(searchText);
    this.setPokemon(await poke);
  }

  alternate(event: any) {
    this.showStats = !this.showStats;
    this.showDetails = !this.showDetails;
    this.buttonText = this.showStats ? "Ver descripción" : "Ver estadísticas";
  }



  setPokemon(pokemon: any) {
    this.selectedPokemon = {
      ...pokemon,
      types: pokemon.types.map((typeInfo: any) => ({
        slot: typeInfo.slot,
        name: typeInfo.type.name,
        url: typeInfo.type.url
      })),
      stats: {
        hp: pokemon.stats.find((stat: any) => stat.stat.name === 'hp')?.base_stat || 0,
        attack: pokemon.stats.find((stat: any) => stat.stat.name === 'attack')?.base_stat || 0,
        defense: pokemon.stats.find((stat: any) => stat.stat.name === 'defense')?.base_stat || 0,
        specialAttack: pokemon.stats.find((stat: any) => stat.stat.name === 'special-attack')?.base_stat || 0,
        specialDefense: pokemon.stats.find((stat: any) => stat.stat.name === 'special-defense')?.base_stat || 0,
        speed: pokemon.stats.find((stat: any) => stat.stat.name === 'speed')?.base_stat || 0
      }
    };
    console.log(this.selectedPokemon);
  }

  getTypeClass(typeName: string): string {
    return `type ${typeName.toLowerCase()}`;
  }




}
