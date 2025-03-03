import { Injectable } from '@angular/core';
import {Ability, emptyPokemon, Item, Move, Pokemon, Stats} from "../models/pokemon.model";

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


  async getItem(id: string): Promise<Item> {
    let response = await fetch(`${this.baseUrl}item/${id}`);
    return await response.json();
  }

  async getAbility(id: string): Promise<Ability> {
    let response = await fetch(`${this.baseUrl}ability/${id}`);
    return await response.json();
  }

  async getMove(id: string): Promise<Move> {
    let response = await fetch(`${this.baseUrl}move/${id}`);
    return await response.json();
  }









}
