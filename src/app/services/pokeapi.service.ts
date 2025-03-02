import { Injectable } from '@angular/core';
import {emptyPokemon, Pokemon, Stats} from "../models/pokemon.model";

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {
  baseUrl = 'https://pokeapi.co/api/v2/';
  spriteUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';


  async getAllPoke(page: number, size: number = 20): Promise<emptyPokemon[]> {
    if (page > 5) return [];
    const offset = size * (page - 1);
    const resultFetch = await fetch(`${this.baseUrl}pokemon/?limit=${size}&offset=${offset}`);
    const data = await resultFetch.json();
    if (data.results.length > 0) return data.results;
    return [];
  }

  async getById(id: string): Promise<Pokemon> {
    const response = await fetch(`${this.baseUrl}pokemon/${id}`);
    let pokemon = await response.json();
    pokemon.description = await this.getDescription(id);
    return pokemon as Pokemon;
  }

  async getDescription(id: string | number): Promise<string> {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const resJson = await res.json();
    const texto = resJson.flavor_text_entries.find((texto: any) => texto.language.name === "es");
    return texto ? texto.flavor_text : "No se encontró descripción en español";
  }





}
