import {Component, inject, Input, OnInit} from '@angular/core';
import {ownedPokemon, Party} from "../../../models/pokemon.model";
import {FirebaseService} from "../../../services/firebase.service";
import {SupabaseService} from "../../../services/supabase.service";
import {UtilsService} from "../../../services/utils.service";
import {User} from "../../../models/user.model";
import {CustomInputComponent} from "../custom-input/custom-input.component";
import {HeaderComponent} from "../header/header.component";
import {IonAvatar, IonButton, IonChip, IonContent, IonIcon} from "@ionic/angular/standalone";
import {NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";



@Component({
  selector: 'app-add-update-party',
  templateUrl: './add-update-party.component.html',
  styleUrls: ['./add-update-party.component.scss'],
  imports: [
    CustomInputComponent,
    HeaderComponent,
    IonAvatar,
    IonButton,
    IonContent,
    IonIcon,
    NgIf,
    ReactiveFormsModule,
    IonChip
  ]
})
export class AddUpdatePartyComponent  implements OnInit {
  @Input() party: Party | null = null;
  firebaseService = inject(FirebaseService);
  supabaseService = inject(SupabaseService);
  utilsService = inject(UtilsService);
  currentPokemon: ownedPokemon = {} as ownedPokemon;

  user = {} as User;

  constructor() { }

  ngOnInit() {
    this.user = this.utilsService.getFromLocalStorage('user');
    if (this.party) {
      this.setParty(this.party)
    }
  }

  setParty(party: Party) {

  }

  async submit() {
    if (this.validate()) {
      if (this.party) {
        this.updateParty();
      } else {
        this.createParty();
      }
    }
  }

  validate(): boolean {
    return false;
  }

  async createParty() {

  }

  async updateParty() {

  }



  getPokemonImage(pokemonId: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
  }


}
