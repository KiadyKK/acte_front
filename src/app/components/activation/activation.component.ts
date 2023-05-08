import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActeMasseService } from 'src/app/services/acteMasse/acte-masse.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalListeServicesComponent } from './modal-liste-services/modal-liste-services.component';
import { ModalChecklisteServicesComponent } from './modal-checkliste-services/modal-checkliste-services.component';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css'],
})
export class ActivationComponent {
  @ViewChild('inputFile')
  inputFile: ElementRef;

  private selectedFile: File | null;

  public reasons: any;
  public rateplans: any;
  public serviceRateplans: any;
  public date: Date = new Date();
  public checkDate: boolean = false;
  public client: any = '';
  public custcode: string = '';
  public description: string = '';
  public commentaire: string = '';
  public nbLigne: string;
  public contenu: Array<any> = [];
  public fichier: string = '';
  public nbrError: string = '';
  public selectedReason: any;
  public selectedRateplans: any;
  public listServices: Array<any> = [];
  public listParametres: any;

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

    this.acteMasseService.getRateplansRead().subscribe({
      next: (data) => {
        this.rateplans = data.sort((a: any, b: any) => {
          return a.rpDes.localeCompare(b.rpDes);
        });
      },
    });
  }

  onFileChange(event: any): void {
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

          let listeMsisdns: Array<any> = [];
          let listeSims: Array<any> = [];

          for (let i = 0; i < allTextLines.length; i++) {
            listeMsisdns.push(allTextLines[i].split(';')[0]);
            listeSims.push(allTextLines[i].split(';')[1]);
          }

          let duplicateMsisdns: Array<any> = this.findDuplicates(
            listeMsisdns,
            true,
            [12]
          );
          let duplicateSims: Array<any> = this.findDuplicates(
            listeSims,
            true,
            [19, 20]
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
          } else if (duplicateSims.length) {
            let duplicate: string = '';
            duplicateSims.forEach((element) => {
              duplicate += '- ' + element + '\n';
            });
            alert(
              'Erreur SIM. Veulliez vérifier ces informations : \n' + duplicate
            );
            this.clear();
          } else {
            let listeMsisdn: Array<any> = this.findDuplicates(
              listeMsisdns,
              false
            );

            let listeSim: Array<any> = this.findDuplicates(listeSims, false);

            let csv: Array<any> = [];

            for (let i = 0; i < listeMsisdn.length; i++) {
              csv.push({
                msisdn: listeMsisdn[i],
                sim:
                  listeSim[i].length === 19 ? listeSim[i] + '*' : listeSim[i],
              });
            }

            let data: any = {
              id_action: 1,
              csv: csv,
              fichier: this.selectedFile!.name,
            };

            this.acteMasseService.verifyActivation(data).subscribe({
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

  onRateplansChange(): void {
    this.listServices = [];
    this.listParametres = [];
    let { rpcode, rpVscode } = this.selectedRateplans;
    this.acteMasseService.getServiceRateplans(rpcode, rpVscode).subscribe({
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

  onCheckboxChange(event: any, key: any): void {
    this.listParametres = [];
    let service = this.serviceRateplans[key].filter((item: any) => {
      return item.servicename === event.target.value;
    });

    if (event.target.checked) {
      if (service[0].serviceParamerterInd) {
        this.service = service[0];
        let { sncode, sccode } = service[0];
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

  openModalListeService() {
    const modalRef = this.modalService.open(ModalListeServicesComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.services = this.listServices;
    modalRef.componentInstance.selectedRateplans = this.selectedRateplans.rpDes;
  }

  disableValider(): boolean {
    return (
      this.fichier === '' ||
      !this.selectedReason ||
      this.client === '' ||
      +this.nbrError !== 0 ||
      this.description === '' ||
      this.commentaire === '' ||
      !this.listServices.length
    );
  }

  valider(): void {
    let requiredServices: Array<any> = [];
    for (const key in this.serviceRateplans) {
      this.serviceRateplans[key].forEach((item: any, index: number) => {
        if (item.svCsind == 'true') {
          requiredServices.push(item);
        }
      });
    }

    let checkService = requiredServices.filter((requiredService: any) => {
      return !this.listServices.some((listService: any) => {
        return requiredService.servicename === listService.servicename;
      });
    });

    if (checkService.length) {
      this.openModalCheckService(checkService);
    } else {
      let data: any = {
        initiateur: this.storageService.getItem('trigramme'),
        idUtilisateur: +this.storageService.getItem('user_id'),
        client: this.client,
        plan_tarifaire: this.selectedRateplans,
        service: this.listServices,
        descript_court: this.description,
        comment: this.commentaire,
        listeMsisdn: {
          fichier: this.fichier,
          nbLigne: this.nbLigne,
          nb_erreur: this.nbrError,
          liste: this.contenu,
        },
        date_prise_compte: this.date,
        rsCode: this.selectedReason.rsCode,
        rsDes: this.selectedReason.rsDes,
        checkdateprise: this.checkDate ? 'true' : 'false',
        idAction: 1,
        etat: 'PENDING',
        lblAction: 'Nouvelle Activation',
        lbl_etape: 'En attente de validation métier',
      };

      const formData: FormData = new FormData();
      formData.append('file', this.selectedFile!);
      formData.append('data', JSON.stringify(data));

      this.acteMasseService.saveActivation(formData).subscribe({
        next: (data) => {
          if (data) {
            alert('Erreur : ' + data);
          } else {
            alert('Enregistrement effectué !');
            this.clear();
            this.commentaire = '';
            this.description = '';
            this.contenu = [];
          }
        },
      });
    }
  }

  openModalCheckService(services: any) {
    const modalRef = this.modalService.open(ModalChecklisteServicesComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.services = services;
  }

  clear(): void {
    this.inputFile.nativeElement.value = '';
    this.selectedFile = null;
    this.date = new Date();
    this.custcode = '';
    this.fichier = '';
    this.client = '';
    this.nbLigne = '';
    this.nbrError = '';
    this.checkDate = false;
    this.serviceRateplans = null;
    this.listParametres = [];
  }
}
