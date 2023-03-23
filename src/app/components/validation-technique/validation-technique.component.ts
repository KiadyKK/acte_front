import { Component } from '@angular/core';
import { Interaction } from 'src/app/models/interaction.model';
import { MetierService } from 'src/app/services/metier/metier.service';
import { TechniqueService } from 'src/app/services/technique/technique.service';

@Component({
  selector: 'app-validation-technique',
  templateUrl: './validation-technique.component.html',
  styleUrls: ['./validation-technique.component.css'],
})
export class ValidationTechniqueComponent {
  public date: Date = new Date();
  public comValidateur: string;
  public content: Interaction = new Interaction();

  constructor(
    private metierService: MetierService,
    private techniqueService: TechniqueService
  ) {}

  onActeClick(idActe: number): void {
    this.metierService.afficherInteraction(idActe).subscribe({
      next: (data: Interaction) => {
        this.content = data;
        this.date = new Date(data.date_prise_compte!);
        this.comValidateur = data.commentaire!;
      },
    });
  }

  rejeter(): void {
    if (confirm('Voulez-vous vraiment rejeter cet acte ?')) {
      let data: any = {
        id: this.content.idActe,
        comment: this.comValidateur,
      };
      this.techniqueService.rejeter(data).subscribe({
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
    let date_valide: any;
    if (date_prise_old < this.date) {
      date_valide = this.date;
    } else {
      date_valide = this.content.date_valide;
    }

    let validForm: any =
      this.content.checkdatepriseencompte === 'false'
        ? date_valide
        : this.content.date_prise_compte?.replace(' ', 'T');

    switch (this.content.idAction) {
      //DESACTIVATION*********************************************
      case 3:
        let data: any = {
          id: this.content.idActe,
          listeMsisdn: this.content.input.liste,
          validForm: validForm,
          rsCode: this.content.id_reutilisable,
          titre: 'Désactivation',
          comment: this.comValidateur,
          checkdatepriseencompte: this.content.checkdatepriseencompte,
          type: 2,
        };
        this.metierService.validerJoker(data).subscribe({
          next: (data) => {
            if (!data.error) {
              alert('Validation terminée !');
              this.onActeClick(this.content.idActe);
            } else {
              alert(data.error + ' Msisdn : ' + data.msisdnError);
            }
          },
        });
        break;

      default:
        break;
    }
  }
}
