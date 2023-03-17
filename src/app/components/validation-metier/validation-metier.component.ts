import { Component } from '@angular/core';
import { MetierService } from 'src/app/services/metier/metier.service';
import { Interaction } from 'src/app/models/interaction.model';

@Component({
  selector: 'app-validation-metier',
  templateUrl: './validation-metier.component.html',
  styleUrls: ['./validation-metier.component.css'],
})
export class ValidationMetierComponent {
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
    let date_prise_new: any;
    if (date_prise_old >= this.date) {
      date_prise_new = null;
    } else {
      date_prise_new = this.date;
    }
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
        }
      },
    });
  }
}
