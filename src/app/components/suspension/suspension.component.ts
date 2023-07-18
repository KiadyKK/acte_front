import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActeMasseService } from 'src/app/services/acteMasse/acte-masse.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ModalResumeComponent } from 'src/app/shared/modal-resume/modal-resume.component';
import { ModalSavingComponent } from 'src/app/shared/modal-saving/modal-saving.component';

@Component({
  selector: 'app-suspension',
  templateUrl: './suspension.component.html',
  styleUrls: ['./suspension.component.css'],
})
export class SuspensionComponent {
  @ViewChild('inputFile')
  inputFile: ElementRef;

  private selectedFile: File | null;

  public reasons: any;
  public date: Date = new Date();
  public checkDate: boolean = false;
  public description: string = '';
  public commentaire: string = '';
  public nbLigne: string;
  public contenu: Array<any> = [];
  public fichier: string = '';
  public nbrError: number = 0;
  public selectedReason: any;
  public listeMsisdn: Array<any>;

  constructor(
    private storageService: StorageService,
    private acteMasseService: ActeMasseService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.acteMasseService.getReasonsRead('s').subscribe({
      next: (data) => {
        this.reasons = data;
      },
    });
  }

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
          let duplicates: Array<any> = this.findDuplicates(allTextLines, true);
          if (duplicates.length) {
            let duplicate: string = '';
            duplicates.forEach((element) => {
              duplicate += '- ' + element + '\n';
            });
            alert(
              'Erreur doublon. Veulliez vérifier ces informations : \n' +
                duplicate
            );
          } else {
            let listeMsisdn: Array<any> = this.findDuplicates(
              allTextLines,
              false
            );
            this.listeMsisdn = listeMsisdn;
            let data: any = {
              id_action: 12,
              msisdn: listeMsisdn,
              fichier: this.selectedFile!.name,
            };
            this.acteMasseService.verifySuspension(data).subscribe({
              next: (data) => {
                if (data.hasOwnProperty('liste')) {
                  this.contenu = data.liste;
                  this.fichier = this.selectedFile!.name;
                  this.nbLigne = data.liste.length;
                  this.nbrError = data.nb_erreur;
                } else {
                  this.clear();
                  alert(
                    'Msisdn incorrecte : ' +
                      data.msisdn +
                      '\nErreur : ' +
                      data.error
                  );
                }
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

  findDuplicates(array: Array<any>, duplicate: boolean): Array<any> {
    if (duplicate) {
      return array.filter(
        (item, index) => array.indexOf(item) !== index && item !== ''
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
      !this.selectedReason ||
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
      rsCode: this.selectedReason.rsCode,
      rsDes: this.selectedReason.rsDes,
      descript_court: this.description,
      checkdateprise: this.checkDate ? 'true' : 'false',
      idAction: 12,
      etat: 'PENDING',
      lblAction: 'Suspension',
      lbl_etape: 'En attente de validation métier',
    };

    const formData: FormData = new FormData();
    formData.append('file', this.selectedFile!);
    formData.append('data', JSON.stringify(data));

    this.acteMasseService.saveSuspension(formData).subscribe({
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
    this.checkDate = false;
    this.selectedReason = ''
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
