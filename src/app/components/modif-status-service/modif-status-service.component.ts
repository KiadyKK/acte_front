import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActeMasseService } from 'src/app/services/acteMasse/acte-masse.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ModalSavingComponent } from 'src/app/shared/modal-saving/modal-saving.component';
import { ModalResumeAjoutComponent } from '../ajout-service/modal-resume-ajout/modal-resume-ajout.component';

@Component({
  selector: 'app-modif-status-service',
  templateUrl: './modif-status-service.component.html',
  styleUrls: ['./modif-status-service.component.css'],
})
export class ModifStatusServiceComponent {
  @ViewChild('inputFile')
  inputFile: ElementRef;

  private selectedFile: File | null;

  public reasons: any;
  public selectedReason: any;
  public status: boolean;
  public description: string = '';
  public commentaire: string = '';
  public nbLigne: string;
  public contenu: Array<any> = [];
  public fichier: string = '';
  public nbrError: number = 0;
  public listeMsisdn: Array<any>;
  public ratePlans: any;
  public checkratePlans: boolean;
  public serviceRateplans: any;
  public listServices: Array<any> = [];
  public checkService: boolean = false;

  public service: any;

  constructor(
    private storageService: StorageService,
    private acteMasseService: ActeMasseService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.acteMasseService.getReasonsRead('a').subscribe({
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
              id_action: 11,
              msisdn: listeMsisdn,
              fichier: this.selectedFile!.name,
            };
            this.acteMasseService.verifyModifStatusService(data).subscribe({
              next: (data) => {
                if (data.hasOwnProperty('liste')) {
                  const rpcode = data.liste[0].rpcode;
                  const rpVscode = data.liste[0].rpVscode;
                  const rpDes = data.liste[0].notification;
                  this.ratePlans = {
                    rpcode: rpcode,
                    rpVscode: rpVscode,
                    rpDes: rpDes,
                  };
                  this.checkratePlans = data.liste.every(
                    (item: any) => item.rpcode === rpcode
                  );
                  if (!this.checkratePlans) {
                    alert('Les numéros doivent avoir le même plan tarifaire');
                  } else {
                    this.acteMasseService
                      .getServiceRateplans(rpcode, rpVscode)
                      .subscribe({
                        next: (data) => {
                          if (data.length) {
                            let result = data.reduce((acc: any, cur: any) => {
                              acc[cur.nom_package] = acc[cur.nom_package] || [];
                              acc[cur.nom_package].push(cur);
                              return acc;
                            }, {});

                            let resultSorted = Object.keys(result)
                              .sort()
                              .reduce((acc: any, cur: any) => {
                                acc[cur] = result[cur];
                                return acc;
                              }, {});

                            this.serviceRateplans = resultSorted;
                          } else {
                            alert('Aucun service pour ce plan tarifaire');
                          }
                        },
                      });
                  }
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

  onCheckboxChange(event: any, key: any): void {
    this.checkService = true;
    let service = this.serviceRateplans[key].filter((item: any) => {
      return item.servicename === event.target.value;
    });

    let { sncode, sccode } = service[0];

    let msisdnError: string = '';
    for (let i = 0; i < this.contenu.length; i++) {
      if (this.contenu[i].service.includes(sncode)) {
        msisdnError += '-' + this.contenu[i].msisdn + '\n';
      }
    }

    if (msisdnError !== '') {
      alert(
        'Ce service est déja utilisé par le(s) numéro(s) suivant(s) : \n' +
          msisdnError
      );
    } else {
      if (event.target.checked) {
        let new_service: any = {
          sncode: service[0].sncode,
          spcode: service[0].spcode,
          servicename: service[0].servicename,
        };
        this.listServices.push(new_service);
      } else {
        const index = this.listServices.findIndex(
          (x) => x.servicename === service[0].servicename
        );
        if (index > -1) {
          this.listServices.splice(index, 1);
        }
      }
    }
  }

  disableValider(): boolean {
    return this.fichier === '' ||
      !this.checkratePlans ||
      !this.selectedReason ||
      this.nbrError !== 0 ||
      this.description === '' ||
      this.commentaire === ''
      ? true
      : false;
  }

  valider(): void {
    let data: any = {
      initiateur: this.storageService.getItem('trigramme'),
      idUtilisateur: +this.storageService.getItem('user_id'),
      plan_tarifaire: this.ratePlans,
      service: this.listServices,
      status: this.status,
      comment: this.commentaire,
      listeMsisdn: {
        fichier: this.fichier,
        nbLigne: this.nbLigne,
        nb_erreur: this.nbrError,
        liste: this.contenu,
      },
      descript_court: this.description,
      id_reutilisable: this.selectedReason.rsCode,
      lblraison: this.selectedReason.rsDes,
      idAction: 11,
      etat: 'PENDING',
      lblAction: 'Modification status service',
      lbl_etape: 'En attente de validation métier',
    };

    const formData: FormData = new FormData();
    formData.append('file', this.selectedFile!);
    formData.append('data', JSON.stringify(data));

    this.acteMasseService.saveAjoutService(formData).subscribe({
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
    this.contenu = [];
    this.selectedReason = '';
    this.fichier = '';
    this.checkService = false;
    this.serviceRateplans = [];
    this.listServices = [];
    this.nbLigne = '';
    this.nbrError = 0;
  }

  openModalResume() {
    const modalRef = this.modalService.open(ModalResumeAjoutComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.services = this.listServices;
    modalRef.componentInstance.nbLigne = this.nbLigne;
    modalRef.componentInstance.nbrError = this.nbrError;
  }
}
