import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActeMasseService } from 'src/app/services/acteMasse/acte-masse.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ModalSavingComponent } from 'src/app/shared/modal-saving/modal-saving.component';
import { ModalResumeAjoutComponent } from './modal-resume-ajout/modal-resume-ajout.component';

@Component({
  selector: 'app-ajout-service',
  templateUrl: './ajout-service.component.html',
  styleUrls: ['./ajout-service.component.css'],
})
export class AjoutServiceComponent {
  @ViewChild('inputFile')
  inputFile: ElementRef;

  private selectedFile: File | null;

  public reasons: any;
  public selectedReason: any;
  public date: Date = new Date();
  public checkDate: boolean = false;
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
  public listParametres: any;
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
              id_action: 5,
              msisdn: listeMsisdn,
              fichier: this.selectedFile!.name,
            };
            this.acteMasseService.verifyAjoutService(data).subscribe({
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
    this.listParametres = [];
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
      alert('Ce service est déja utilisé par le(s) numéro(s) suivant(s) : \n' + msisdnError);
    } else {
      if (event.target.checked) {
        if (service[0].serviceParamerterInd) {
          this.service = service[0];
          this.acteMasseService.getParametersRead(sncode, sccode).subscribe({
            next: (data) => {
              this.listParametres = data;
              this.updateViaService(data, service);
            },
          });
        } else {
          let new_service: any = {
            sncode: service[0].sncode,
            spcode: service[0].spcode,
            servicename: service[0].servicename,
          };
          this.listServices.push(new_service);
        }
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

  updateViaService(result: any, service: any): void {
    let parametre: Array<any> = [];
    let { sncode, spcode, servicename } = service[0];
    // Si le projet dispose de plusieurs parametres
    for (let i = 0; i < result.length; i++) {
      // Verifier si un sous parametre dispose de valeurs par defaut
      if (result[i].hasOwnProperty('defValue')) {
        for (let j = 0; j < result[i].nValues.length; j++) {
          if (result[i].defValue == result[i].nValues[j].value) {
            let valueSeqno =
              result[i].nValues[j].valueSeqno == null
                ? 1
                : result[i].nValues[j].valueSeqno;
            let valueDes =
              result[i].nValues[j].valueDes == null
                ? result[i].nValues[j].value
                : result[i].nValues[j].valueDes;
            let value =
              result[i].type == 'LB' ? valueSeqno : result[i].nValues[j].value;

            let prmNo = result[i].prmNo;
            let prmDes = result[i].prmDes;
            let param_parametre_resultat = {
              prmNo: prmNo,
              prmDes: prmDes,
              valueSeqno: valueSeqno,
              value: value,
              valueDes: valueDes,
            };
            parametre.push(param_parametre_resultat);
          }
        }

        // Si le parametre en question dispose du type DF donc, on ne prend pas les nvalue mais le textareo qui dispose d'une valeur par défaut
        if (result[i].type == 'DF') {
          let value = result[i].defValue;
          let valueDes = result[i].defValue;
          let valueSeqno = 1;
          let prmNo = result[i].prmNo;
          let prmDes = result[i].prmDes;
          let param_parametre_resultat = {
            prmNo: prmNo,
            prmDes: prmDes,
            valueSeqno: valueSeqno,
            value: value,
            valueDes: valueDes,
          };
          parametre.push(param_parametre_resultat);
        }
      }
    }

    if (parametre.length) {
      let new_service = {
        sncode: sncode,
        spcode: spcode,
        servicename: servicename,
        parametre: parametre,
      };
      this.listServices.push(new_service);
    }
  }

  onRadioParameterChange(parametre: any, nvalue: any): void {
    let valueseqno_par_defaut = nvalue.valueSeqno ?? 1;
    let valueDes_par_defaut = nvalue.valueDes ?? nvalue.value;
    nvalue.value =
      parametre.type === 'LB' ? valueseqno_par_defaut : nvalue.value;
    let { servicename } = this.service;
    let param_parametre = {
      prmNo: parametre.prmNo,
      prmDes: parametre.prmDes,
      valueSeqno: valueseqno_par_defaut,
      value: nvalue.value,
      valueDes: valueDes_par_defaut,
    };

    for (let i = 0; i < this.listParametres.length; i++) {
      if (this.listParametres[i].prmNo == parametre.prmNo) {
        this.listParametres[i].defValue = nvalue.value;
      }
    }

    if (this.listServices.length) {
      let index_service: number = 0;
      let check_service: boolean = false;
      let check_parameter: boolean = false;

      for (let i = 0; i < this.listServices.length; i++) {
        if (this.listServices[i].servicename === servicename) {
          for (let j = 0; j < this.listServices[i].parametre.length; j++) {
            if (
              param_parametre.prmNo ==
                this.listServices[i].parametre[j].prmNo &&
              param_parametre.value !=
                this.listServices[i].parametre[j].value &&
              param_parametre.valueDes !=
                this.listServices[i].parametre[j].valueDes
            ) {
              this.listServices[i].parametre.splice(j, 1);
              this.listServices[i].parametre.push(param_parametre);
              check_service = true;
              check_parameter = false;
              break;
            } else {
              index_service = i;
              check_service = false;
              check_parameter = true;
            }
          }
        }
      }

      if (!check_service && check_parameter) {
        this.listServices[index_service].parametre.push(param_parametre);
      } else if (!check_service && !check_parameter) {
        this.insertService(param_parametre);
      }
    } else {
      this.insertService(param_parametre);
    }
  }

  onTextParameterChange(event: any, parametre: any): void {
    let { value } = event.target;
    let { servicename } = this.service;
    let param_parametre = {
      prmNo: parametre.prmNo,
      prmDes: parametre.prmDes,
      valueSeqno: 1,
      value: value,
      valueDes: value,
    };

    for (let i = 0; i < this.listParametres.length; i++) {
      if (this.listParametres[i].prmNo == parametre.prmNo) {
        this.listParametres[i].defValue = value;
      }
    }

    if (this.listServices.length) {
      let index_service: number = 0;
      let check_service: boolean = false;
      let check_parameter: boolean = false;

      for (let i = 0; i < this.listServices.length; i++) {
        if (this.listServices[i].servicename === servicename) {
          for (let j = 0; j < this.listServices[i].parametre.length; j++) {
            if (
              param_parametre.prmNo == this.listServices[i].parametre[j].prmNo
            ) {
              this.listServices[i].parametre.splice(j, 1);
              this.listServices[i].parametre.push(param_parametre);
              check_service = true;
              check_parameter = false;
              break;
            } else {
              index_service = i;
              check_service = false;
              check_parameter = true;
            }
          }
        }
      }

      if (!check_service && check_parameter) {
        this.listServices[index_service].parametre.push(param_parametre);
      } else if (!check_service && !check_parameter) {
        this.insertService(param_parametre);
      }
    } else {
      this.insertService(param_parametre);
    }
  }

  insertService(param_parametre: any): void {
    let { sncode, spcode, servicename } = this.service;
    let array_parametre: Array<any> = [];
    array_parametre.push(param_parametre);
    let new_service = {
      sncode: sncode,
      spcode: spcode,
      servicename: servicename,
      parametre: array_parametre,
    };
    this.listServices.push(new_service);
  }

  onCheckDateChange(event: any): void {
    this.checkDate = event.target.checked;
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
      id_reutilisable: this.selectedReason.rsCode,
      lblraison: this.selectedReason.rsDes,
      idAction: 5,
      etat: 'PENDING',
      lblAction: 'Ajout de service',
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
    this.listServices = []
    this.listParametres = [];
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
