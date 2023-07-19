import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActeMasseService } from 'src/app/services/acteMasse/acte-masse.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ModalResumeComponent } from 'src/app/shared/modal-resume/modal-resume.component';
import { ModalSavingComponent } from 'src/app/shared/modal-saving/modal-saving.component';

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
  public nbrError: number = 0;

  page = 1;
  pageSize = 4;

  constructor(
    private storageService: StorageService,
    private acteMasseService: ActeMasseService,
    private modalService: NgbModal
  ) {}

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files.item(0);
      if (this.selectedFile!.type === 'text/csv' || this.selectedFile!.type === 'application/vnd.ms-excel') {
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
              msisdn: col[4],
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
                for (let i = 0; i < listeMsisdn.length; i++) {
                  for (let j = 0; j < data.liste.length; j++) {
                    if (listeMsisdn[i].msisdn === data.liste[j].msisdn) {
                      data.liste[j].adrLname = listeMsisdn[i].adrLname;
                      data.liste[j].adrName = listeMsisdn[i].adrName;
                      data.liste[j].adrStreet = listeMsisdn[i].adrStreet;
                      data.liste[j].adrCity = listeMsisdn[i].adrCity;
                    }
                  }
                }

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
      // this.nbrError !== 0 ||
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
    formData.append('file', this.selectedFile!);
    formData.append('data', JSON.stringify(data));

    this.acteMasseService.saveModifyFields(formData).subscribe({
      next: (data) => {
        if (data) {
          this.openModalSaving(data);
        } else {
          this.openModalSaving();
          this.commentaire = '';
          this.description = '';
          this.contenu = [];
        }
        this.clear();
      },
    });
  }

  openModalSaving(error: string | null = null, type: number = 1) {
    const modalRef = this.modalService.open(ModalSavingComponent, {
      size: 'sm',
      centered: true,
    });
    modalRef.componentInstance.error = error;
    modalRef.componentInstance.type = type;
  }

  clear(): void {
    this.inputFile.nativeElement.value = '';
    this.selectedFile = null;
    this.fichier = '';
    this.nbLigne = '';
    this.nbrError = 0;
  }

  openModalResume() {
    const modalRef = this.modalService.open(ModalResumeComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.nbLigne = this.nbLigne;
    modalRef.componentInstance.nbrError = this.nbrError;
  }
}
