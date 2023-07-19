import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActeMasseService } from 'src/app/services/acteMasse/acte-masse.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ModalResumeComponent } from 'src/app/shared/modal-resume/modal-resume.component';
import { ModalSavingComponent } from 'src/app/shared/modal-saving/modal-saving.component';

@Component({
  selector: 'app-limit-conso',
  templateUrl: './limit-conso.component.html',
  styleUrls: ['./limit-conso.component.css'],
})
export class LimitConsoComponent {
  @ViewChild('inputFile')
  inputFile: ElementRef;

  private selectedFile: File | null;

  public date: Date = new Date();
  public checkDate: boolean = false;
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
      if (
        this.selectedFile!.type === 'text/csv' ||
        this.selectedFile!.type === 'application/vnd.ms-excel'
      ) {
        let allTextLines = [];

        // File reader method
        let reader: FileReader = new FileReader();
        reader.readAsText(this.selectedFile!);
        reader.onload = (e) => {
          let csv: any = reader.result;
          allTextLines = csv.split('\r\n');

          let listeMsisdns: Array<any> = [];
          let listeConsos: Array<any> = [];

          for (let i = 0; i < allTextLines.length; i++) {
            listeMsisdns.push(allTextLines[i].split(';')[0]);
            listeConsos.push(allTextLines[i].split(';')[1]);
          }

          let duplicateMsisdns: Array<any> = this.findDuplicates(
            listeMsisdns,
            true,
            [12]
          );

          if (duplicateMsisdns.length) {
            let duplicate: string = '';
            duplicateMsisdns.forEach((element) => {
              duplicate += '- ' + element + '\n';
            });
            alert(
              'Erreur MSISDN. Veulliez vérifier ces informations : \n' +
                duplicate
            );
            this.clear();
          } else {
            let listeMsisdn: Array<any> = this.findDuplicates(
              listeMsisdns,
              false
            );

            // let listeConso: Array<any> = this.findDuplicates(
            //   listeConsos,
            //   false
            // );

            let csv: Array<any> = [];

            for (let i = 0; i < listeMsisdn.length; i++) {
              csv.push({
                msisdn: listeMsisdn[i],
                conso: +listeConsos[i],
              });
            }

            let data: any = {
              id_action: 4,
              csv: csv,
              fichier: this.selectedFile!.name,
            };

            this.acteMasseService.verifyLimitConso(data).subscribe({
              next: (data) => {
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

  findDuplicates(
    array: Array<any>,
    duplicate: boolean,
    length: Array<number> = [0]
  ): Array<any> {
    if (duplicate) {
      return array.filter(
        (item, index) =>
          (array.indexOf(item) !== index && item !== '') ||
          !length.includes(item.length)
      );
    } else {
      return array.filter(
        (item, index) => array.indexOf(item) === index && item !== ''
      );
    }
  }

  onCheckDateChange(event: any): void {
    this.checkDate = event.target.checked;
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
      date_prise_compte: this.date,
      listeMsisdn: {
        fichier: this.fichier,
        nbLigne: this.nbLigne,
        nb_erreur: this.nbrError,
        liste: this.contenu,
      },
      descript_court: this.description,
      checkdateprise: this.checkDate ? 'true' : 'false',
      idAction: 4,
      etat: 'PENDING',
      lblAction: 'Limite Consommation',
      lbl_etape: 'En attente de validation métier',
    };

    const formData: FormData = new FormData();
    formData.append('file', this.selectedFile!);
    formData.append('data', JSON.stringify(data));

    this.acteMasseService.saveLimitConso(formData).subscribe({
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
