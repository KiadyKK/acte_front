import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActeMasseService } from 'src/app/services/acteMasse/acte-masse.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ModalResumeComponent } from 'src/app/shared/modal-resume/modal-resume.component';
import { ModalSavingComponent } from 'src/app/shared/modal-saving/modal-saving.component';

@Component({
  selector: 'app-reengagement',
  templateUrl: './reengagement.component.html',
  styleUrls: ['./reengagement.component.css'],
})
export class ReengagementComponent {
  @ViewChild('inputFile')
  inputFile: ElementRef;

  private selectedFile: File | null;

  public selectedMinComParam: any = null;
  public selectedMinComStatus: any = null;
  public minComParam: any;
  public minComStatus: any;
  public date: Date = new Date();
  public checkDate: boolean = false;
  public description: string = '';
  public commentaire: string = '';
  public nbLigne: string;
  public nbrError: number = 0;
  public fichier: string = '';
  public contenu: Array<any> = [];
  public listeMsisdn: Array<any>;
  public parametres: Array<any> = [];

  constructor(
    private storageService: StorageService,
    private acteMasseService: ActeMasseService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.acteMasseService.getParametersRead(1847, 1).subscribe({
      next: (data) => {
        if (data[0].prmNo === 1) {
          this.minComParam = data[0];
          this.minComStatus = data[1];
        } else {
          this.minComParam = data[1];
          this.minComStatus = data[0];
        }
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
              id_action: 7,
              msisdn: listeMsisdn,
              fichier: this.selectedFile!.name,
            };
            this.acteMasseService.verifyReengagement(data).subscribe({
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
    this.selectedMinComStatus = ''
    this.selectedMinComParam = ''
  }

  openModalResume() {
    const modalRef = this.modalService.open(ModalResumeComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.nbLigne = this.nbLigne;
    modalRef.componentInstance.nbrError = this.nbrError;
  }

  disableValider(): boolean {
    return this.fichier === '' ||
      !this.selectedMinComParam ||
      !this.selectedMinComStatus ||
      this.description === '' ||
      this.commentaire === ''
      ? true
      : false;
  }

  valider(): void {
    this.selectedMinComParam.prmDes = this.minComParam.prmDes;
    this.selectedMinComParam.prmNo = this.minComParam.prmNo;
    this.selectedMinComStatus.prmDes = this.minComStatus.prmDes;
    this.selectedMinComStatus.prmNo = this.minComStatus.prmNo;
    this.parametres.push(this.selectedMinComParam, this.selectedMinComStatus);
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
      idAction: 7,
      etat: 'PENDING',
      lblAction: 'Reengagement',
      lbl_etape: 'En attente de validation métier',
      parametre_service: [
        {
          sncode: 1847,
          servicename: "Durée d'engagement",
          parametre: this.parametres,
        },
      ],
    };
    const formData: FormData = new FormData();
    formData.append('file', this.selectedFile!);
    formData.append('data', JSON.stringify(data));

    this.acteMasseService.saveReengagement(formData).subscribe({
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
}
