import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActeMasseService } from 'src/app/services/acteMasse/acte-masse.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-takeover',
  templateUrl: './takeover.component.html',
  styleUrls: ['./takeover.component.css']
})
export class TakeoverComponent {
  @ViewChild('inputFile')
  inputFile: ElementRef;

  private selectedFile: File | null;

  public custcode: string = '';
  public client: any = '';
  public date: Date = new Date();
  public checkDate: boolean = false;
  public description: string = '';
  public commentaire: string = '';
  public nbLigne: string;
  public nbrError: string = '';
  public fichier: string = '';
  public contenu: Array<any> = [];

  constructor(
    private storageService: StorageService,
    private acteMasseService: ActeMasseService
  ) {}

  onFileChange(event: any) {

  }

  rechercheClient(): void {
    this.acteMasseService.getClient(this.custcode).subscribe({
      next: (data) => {
        if (data) {
          this.client = data;
        } else {
          alert('Client introuvable !');
          this.client = '';
        }
      },
    });
  }

  onCheckDateChange(event: any): void {
    this.checkDate = event.target.checked;
  }

  disableValider(): boolean {
    return this.fichier === '' ||
      this.description === '' ||
      this.commentaire === ''
      ? true
      : false;
  }

  valider(): void {
  }
}
