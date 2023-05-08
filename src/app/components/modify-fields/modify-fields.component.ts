import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActeMasseService } from 'src/app/services/acteMasse/acte-masse.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-modify-fields',
  templateUrl: './modify-fields.component.html',
  styleUrls: ['./modify-fields.component.css'],
})
export class ModifyFieldsComponent {
  @ViewChild('inputFile')
  inputFile: ElementRef;

  private selectedFile: File | null;

  public description: string = '';
  public commentaire: string = '';
  public nbLigne: string;
  public contenu: Array<any> = [];
  public fichier: string = '';
  public nbrError: string = '';

  constructor(
    private storageService: StorageService,
    private acteMasseService: ActeMasseService
  ) {}

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files.item(0);
      if (this.selectedFile!.type === 'text/csv') {
        let allTextLines = [];

        // File reader method
        let reader: FileReader = new FileReader();
        reader.readAsText(this.selectedFile!);
        reader.onload = (e) => {
          let csv: any = reader.result;
          allTextLines = csv.split('\r\n');

          let listeMsisdn: Array<any> = [];
          let msisdnError: string = '';

          for (let i = 0; i < allTextLines.length; i++) {
            let col = allTextLines[i].split(';');
            if (col[4].length !== 12) {
              msisdnError = col[4];
              break;
            }
            listeMsisdn.push({
              adrLname: col[0],
              adrName: col[1],
              adrStreet: col[2],
              adrCity: col[3],
              msisdn: col[4]
            });
          }

          let data: any = {
            id_action: 2,
            csv: listeMsisdn,
            fichier: this.selectedFile!.name,
          };

          if (msisdnError != '') {
            alert('Erreur format msisdn : ' + msisdnError);
            this.clear();
          } else {
            this.acteMasseService.verifyModifyFields(data).subscribe({
              next: (data) => {
                // for (let i = 0; i < listeMsisdn.length; i++) {
                //   for (let j = 0; j < data.liste.length; j++) {
                //     if (listeMsisdn[i].msisdn === data.liste[j].msisdn) {
                //       listeMsisdn[i].s_msisdn = data.liste[j].s_msisdn;
                //       listeMsisdn[i].notification = data.liste[j].notification;
                //     }
                //   }
                // }

                this.contenu = data.liste;
                this.fichier = this.selectedFile!.name;
                this.nbLigne = data.liste.length;
                this.nbrError = data.nb_erreur;
              },
            });
          }
        };
      } else {
        alert('Vous devez uploader un fichier de type .csv');
        this.clear();
      }
    }
  }

  disableValider(): boolean {
    return this.fichier === '' ||
      this.description === '' ||
      this.commentaire === ''
      ? true
      : false;
  }

  valider(): void {
    let data: any = {
      initiateur: this.storageService.getItem('trigramme'),
      idUtilisateur: +this.storageService.getItem('user_id'),
      comment: this.commentaire,
      listeMsisdn: {
        fichier: this.fichier,
        nbLigne: this.nbLigne,
        nb_erreur: this.nbrError,
        liste: this.contenu,
      },
      descript_court: this.description,
      idAction: 2,
      etat: 'PENDING',
      lblAction: 'Modification Info-client',
      lbl_etape: 'En attente de validation métier',
    };

    const formData: FormData = new FormData();
    formData.append('file', this.selectedFile!)
    formData.append('data', JSON.stringify(data))

    this.acteMasseService.saveModifyFields(formData).subscribe({
      next: (data) => {
        if (data) {
          alert('Erreur : ' + data);
          this.clear();
        } else {
          alert('Enregistrement effectué !');
          this.clear();
          this.commentaire = '';
          this.description = '';
          this.contenu = [];
        }
      }
    });
  }

  clear(): void {
    this.inputFile.nativeElement.value = '';
    this.selectedFile = null;
    this.fichier = '';
    this.nbLigne = '';
    this.nbrError = '';
  }
}
