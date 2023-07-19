import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActeMasseService } from 'src/app/services/acteMasse/acte-masse.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ModalResumeComponent } from 'src/app/shared/modal-resume/modal-resume.component';
import { ModalSavingComponent } from 'src/app/shared/modal-saving/modal-saving.component';

@Component({
  selector: 'app-forfait',
  templateUrl: './forfait.component.html',
  styleUrls: ['./forfait.component.css'],
})
export class ForfaitComponent {
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
  public listeMsisdn: Array<any>;
  public listeServiceForfait: Array<any>;
  public servicename: string;
  public sncode: number;
  public selectedService: Array<any> = [];
  public listParamaters: Array<any> = [];

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
              id_action: 9,
              msisdn: listeMsisdn,
              fichier: this.selectedFile!.name,
            };
            this.acteMasseService.verifyForfait(data).subscribe({
              next: (data) => {
                console.log(data);
                if (data.hasOwnProperty('liste')) {
                  const liste = data.liste;
                  const rpcode: number = liste[0].rpcode;

                  let checkHybrid: boolean = liste.every(
                    (item: any) => item.checkHybrid
                  );

                  let checkPlan: boolean = liste.every(
                    (item: any) => item.rpcode === rpcode
                  );

                  if (!checkHybrid) {
                    alert('Les numéros doivent être de type Hybrid.');
                  } else if (!checkPlan) {
                    alert('Les numéros doivent avoir le même plan tarifaire.');
                  } else {
                    this.acteMasseService
                      .getListServiceForfait(rpcode)
                      .subscribe({
                        next: (data) => {
                          this.servicename = data.servicename;
                          this.sncode = data.sncode;
                          this.listeServiceForfait = data.parametersRead;
                        },
                      });
                  }

                  this.contenu = liste;
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

  onSelectChange(item: any, i: number): void {
    let selectedService = this.selectedService[i];
    selectedService.prmDes = item.prmDes;
    selectedService.prmNo = item.prmNo;
    this.listParamaters[i] = selectedService;
  }

  onCheckDateChange(event: any): void {
    this.checkDate = event.target.checked;
  }

  disableValider(): boolean {
    return this.fichier === '' ||
      this.nbrError !== 0 ||
      this.description === '' ||
      this.commentaire === ''
      ? true
      : false;
  }

  valider(): void {
    let parametre = this.listParamaters.filter(
      (item: any) => Object.keys(item).length !== 0
    );
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
      parametre_service: [
        {
          servicename: this.servicename,
          sncode: this.sncode,
          parametre: parametre,
        },
      ],
      idAction: 9,
      etat: 'PENDING',
      lblAction: 'Forfait',
      lbl_etape: 'En attente de validation métier',
    };

    const formData: FormData = new FormData();
    formData.append('file', this.selectedFile!);
    formData.append('data', JSON.stringify(data));

    this.acteMasseService.saveForfait(formData).subscribe({
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
    this.listeServiceForfait = [];
    this.selectedService = [];
    this.listParamaters = [];
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
