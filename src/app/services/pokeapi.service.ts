import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {emptyPokemon} from "../models/pokemon.model";

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {
  baseUrl = 'https://pokeapi.co/api/v2/';
  spriteUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

  constructor(private http: HttpClient) { }

  async getAllPoke(page: number, size: number = 20): Promise<emptyPokemon[]> {
    if (page > 5) return [];
    const offset = size * (page - 1);
    const resultFetch = await fetch(`${this.baseUrl}pokemon/?limit=${size}&offset=${offset}`);
    const data = await resultFetch.json();
    if (data.results.length > 0) return data.results;
    return [];
  }

  async getById(id: string): Promise<emptyPokemon> {
    const response = await fetch(`${this.baseUrl}pokemon/${id}`);
    return await response.json();
  }



}
