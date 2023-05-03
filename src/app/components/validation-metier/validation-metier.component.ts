import { Component } from '@angular/core';
import { MetierService } from 'src/app/services/metier/metier.service';
import { Interaction } from 'src/app/models/interaction.model';
import { GlobalConstants } from 'src/app/shared/globalConstants/global-constants';

@Component({
  selector: 'app-validation-metier',
  templateUrl: './validation-metier.component.html',
  styleUrls: ['./validation-metier.component.css'],
})
export class ValidationMetierComponent {
  public apiUrl: string = GlobalConstants.apiURL;
  public date: Date = new Date();
  public comValidateur: string;
  public joker: boolean = false;
  public content: Interaction = new Interaction();
  constructor(private metierService: MetierService) {}

  onActeClick(idActe: number): void {
    this.metierService.afficherInteraction(idActe).subscribe({
      next: (data: Interaction) => {
        this.content = data;
        this.date = new Date(data.date_prise_compte!);
        this.comValidateur = data.commentaire!;
      },
    });
  }

  onJokerChange(event: any): void {
    this.joker = event.target.checked;
  }

  rejeter(): void {
    if (confirm('Voulez-vous vraiment rejeter cet acte ?')) {
      let data: any = {
        id: this.content.idActe,
        comment: this.comValidateur,
      };
      this.metierService.rejeter(data).subscribe({
        next: (data) => {
          if (data > 0) {
            alert('Annulation terminée !');
            this.content = new Interaction();
          } else {
            alert('Annulation echouée !');
          }
        },
      });
    }
  }

  valider(): void {
    let date_prise_old: Date = new Date(this.content.date_prise_compte!);
    let date_prise_new: any = date_prise_old >= this.date ? null : this.date;

    if (this.joker) {
      let validForm: any =
        this.content.checkdatepriseencompte === 'false'
          ? new Date()
          : this.content.date_prise_compte?.replace(' ', 'T');
      switch (this.content.idAction) {
        case 1:
        //NOUVELLE ACTIVATION***************************************
          let data1: any = {
            id: this.content.idActe,
            listeMsisdn: this.content.input.liste,
            validForm: validForm,
            titre: 'Nouvelle activation',
            checkdatepriseencompte: this.content.checkdatepriseencompte,
            comment: this.comValidateur,
          }
          this.metierService.validerJoker(data1).subscribe({
            next: (data) => {
              console.log(data);
              if (!data.error) {
                alert('Validation terminée !');
                this.onActeClick(this.content.idActe);
              } else {
                alert('Msisdn : ' + data.msisdnError + '\nError : ' + data.error);
              }
            },
          });

          break;
        //DESACTIVATION*********************************************
        case 3:
          let data: any = {
            id: this.content.idActe,
            listeMsisdn: this.content.input.liste,
            validForm: validForm,
            rsCode: this.content.id_reutilisable,
            titre: 'Désactivation',
            checkdatepriseencompte: this.content.checkdatepriseencompte,
            comment: this.comValidateur,
            date_prise_new: date_prise_new,
            type: 2,
          };
          this.metierService.validerJoker(data).subscribe({
            next: (data) => {
              if (!data.error) {
                alert('Validation terminée !');
                this.onActeClick(this.content.idActe);
              } else {
                alert('Msisdn : ' + data.msisdnError + '\nError : ' + data.error);
              }
            },
          });

          break;

        default:
          break;
      }
    } else {
      let data: any = {
        id: this.content.idActe,
        comment: this.comValidateur,
        date_prise_new: date_prise_new,
        type: 1,
      };
      this.metierService.valider(data).subscribe({
        next: (data) => {
          if (data) {
            alert('Validation terminée !');
            this.onActeClick(this.content.idActe);
          } else {
            alert('Validation echouée !');
          }
        },
      });
    }
  }
}
