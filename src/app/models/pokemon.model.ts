export interface emptyPokemon {
  id?: string;
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Type[];
  abilities: Ability[];
  sprites: Sprites;
  stats: Stats;
  description: string;
}

export interface Sprites {
  front_default: string;
  front_shiny: string| undefined;
  back_default: string| undefined;
  back_shiny: string| undefined;
}

export interface Stats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}
export interface Ability {
  name: string;
  url: string;
  is_hidden: boolean;
  slot: number;
}
export interface Type {
  slot: number;
  name: string;
  url: string;
}


export const examplePokemon: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  types: [
    {
      slot: 1,
      name: 'grass',
      url: 'https://pokeapi.co/api/v2/type/12/'
    },
    {
      slot: 2,
      name: 'poison',
      url: 'https://pokeapi.co/api/v2/type/4/'
    }
  ],
  abilities: [
    {
      name: 'overgrow',
      url: 'https://pokeapi.co/api/v2/ability/65/',
      is_hidden: false,
      slot: 1
    },
    {
      name: 'chlorophyll',
      url: 'https://pokeapi.co/api/v2/ability/34/',
      is_hidden: true,
      slot: 3
    }
  ],
  sprites: {
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    front_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png',
    back_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
    back_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/1.png'
  },
  stats: {
    hp: 45,
    attack: 49,
    defense: 49,
    specialAttack: 65,
    specialDefense: 65,
    speed: 45
  },
  description: 'For some time after its birth, it grows by gaining nourishment from the seed on its back.'

}
