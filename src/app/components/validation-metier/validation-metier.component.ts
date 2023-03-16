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
      next: (data) => {
        this.content = data;
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
        comment: this.comValidateur
      }
      this.metierService.rejeter(data).subscribe({
        next: data => {
          console.log(data);
        }
      })
    }
  }
}
