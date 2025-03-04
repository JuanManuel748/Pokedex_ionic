import { Component, OnDestroy, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  ToastController
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { PokeapiService } from '../../../services/pokeapi.service';
import { Pokemon } from '../../../models/pokemon.model';
import { SensorService } from "../../../services/sensor.service";
import { Subscription } from "rxjs";

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
  isShiny: boolean = false;


  sensorService = inject(SensorService);
  private accelerometerDataSubscription: Subscription | null = null;
  accelerometerData: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };

  private lastX: number = 0;
  private lastY: number = 0;
  private lastZ: number = 0;
  private shakeThreshold: number = 15; // Ajusta este valor según sea necesario


  urlSound = "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/1.ogg";


  constructor(private pokeapi: PokeapiService, private toastController: ToastController) { }

  async ngOnInit() {
    this.setPokemon(await this.pokeapi.getById('1'));
    this.sensorService.startListeningToMotion();
    this.accelerometerDataSubscription = this.sensorService
      .getAccelerometerData()
      .subscribe((data) => {
        this.accelerometerData = data;
        this.detectShake(data);
      });
  }

  ngOnDestroy() {
    if (this.accelerometerDataSubscription) {
      this.accelerometerDataSubscription.unsubscribe();
    }
    this.sensorService.stopListeningToMotion();
  }

  detectShake(data: { x: number; y: number; z: number }) {
    const deltaX = Math.abs(data.x - this.lastX);
    const deltaY = Math.abs(data.y - this.lastY);
    const deltaZ = Math.abs(data.z - this.lastZ);

    if (deltaX > this.shakeThreshold || deltaY > this.shakeThreshold || deltaZ > this.shakeThreshold) {
      this.onShake();
    }

    this.lastX = data.x;
    this.lastY = data.y;
    this.lastZ = data.z;
  }
  onShake() {
    if (this.selectedPokemon) {

      const audio = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${this.selectedPokemon.id}.ogg`);
      audio.play().catch(error => console.error('Error playing sound:', error));

      this.toastController.create({
        message: 'Shake detected!',
        duration: 2000
      }).then((toast) => {
        toast.present();
      });
    }
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

  alternateShiny(event: any) {
    this.isShiny = !this.isShiny;
  }

  getPokemonImage(pokemonId: string | undefined, isShiny: boolean = false): string {
    const shinySuffix = isShiny ? 'shiny/' : '';
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shinySuffix}${pokemonId}.png`;
  }




}
