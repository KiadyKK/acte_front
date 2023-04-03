import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActeMasseService } from 'src/app/services/acteMasse/acte-masse.service';
import { SoapService } from 'src/app/services/soap/soap.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css'],
})
export class ActivationComponent {
  @ViewChild('inputFile')
  inputFile: ElementRef;

  public reasons: any;
  public rateplans: any;
  public serviceRateplans: any;
  public date: Date = new Date();
  public checkDate: boolean = false;
  public custcode: string = '';
  public description: string = '';
  public commentaire: string = '';
  public nbLigne: string;
  public contenu: Array<any> = [];
  public fichier: string = '';
  public nbrError: string;
  public selectedReason: any;
  public selectedRateplans: any;
  public listeMsisdn: Array<any>;
  public form: FormGroup;
  public listServices: Array<any> = [];
  public listParametres: any;

  constructor(
    private soapService: SoapService,
    private storageService: StorageService,
    private acteMasseService: ActeMasseService
  ) {}

  ngOnInit(): void {
    this.soapService.getReasonsRead('a').subscribe({
      next: (data) => {
        this.reasons = data;
      },
    });

    this.soapService.getRateplansRead().subscribe({
      next: (data) => {
        this.rateplans = data.sort((a: any, b: any) => {
          return a.rpDes.localeCompare(b.rpDes);
        });
      },
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      let file: File = event.target.files.item(0);
      let allTextLines = [];

      // File reader method
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
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
          listeMsisdn.forEach((item, index) => {
            listeMsisdn[index] = item.replace(';', '');
          });
          this.listeMsisdn = listeMsisdn;
          let data: any = {
            id_action: 3,
            msisdn: listeMsisdn,
            fichier: file.name,
          };
          // this.soapService.verifydesactivation(data).subscribe({
          //   next: (data) => {
          //     if (data.hasOwnProperty('liste')) {
          //       this.contenu = data.liste;
          //       this.fichier = file.name;
          //       this.nbLigne = data.liste.length;
          //       this.nbrError = data.nb_erreur;
          //     } else {
          //       let msisdn: string = '\n';
          //       data.forEach((element: string) => {
          //         msisdn += '- ' + element + '\n';
          //       });
          //       this.clear();
          //       alert('Msisdn incorrecte :' + msisdn);
          //     }
          //   },
          // });
        }
      };
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

  rechercheClient(): void {
    this.soapService.getClient(this.custcode).subscribe({
      next: (data) => {
        console.log(data);
      },
    });
  }

  onRateplansChange(): void {
    let { rpcode, rpVscode } = this.selectedRateplans;
    this.soapService.getServiceRateplans(rpcode, rpVscode).subscribe({
      next: (data) => {
        // for (let i = 0; i < data.length; i++) {
        //   data.filter((item: any) => {
        //     if (item.sncode === 325 || item.sncode === 2564) {
        //       console.log(item);
        //       return;
        //     }
        //   })
        //   break;
        // }
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

  onCheckboxChange(event: any, key: any) {
    let service = this.serviceRateplans[key].filter((item: any) => {
      return item.servicename === event.target.value;
    });

    console.log('serviceParamerterInd', service[0].serviceParamerterInd);

    if (event.target.checked) {
      if (service[0].serviceParamerterInd) {
        let { sncode, sccode } = service[0];
        this.soapService.getParametersRead(sncode, sccode).subscribe({
          next: (data) => {
            console.log(data);
            this.listParametres = data;
            // this.updateViaService(data, service);
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
      this.listServices.splice(index, 1);
    }
  }

  updateViaService(result: any, service: any): void {
    let parametre = [];
    let { sncode, spcode, servicename } = service[0];

    if (result.length > 1) {
      // Si le projet dispose de plusieurs parametres
      for (let i = 0; i < result.length; i++) {
        // Verifier si un parametre dispose des sous parametres
        if (result[i].nValues) {
          // Verifier si un sous parametre dispose de valeurs par defaut
          if (result[i].defValue) {
            if (!Array.isArray(result[i].nValues)) {
              if (result[i].defValue == result[i].nValues.value) {
                let value = result[i].nValues.value;
                let valueSeqno: any;
                let valueDes: any;

                if (result[i].nValues.valueSeqno == null) {
                  valueSeqno = 1;
                } else {
                  valueSeqno = result[i].nValues.valueSeqno;
                }

                if (result[i].nValues.valueDes == null) {
                  valueDes = result[i].nValues.value;
                } else {
                  valueDes = result[i].nValues.valueDes;
                }

                if (result[i].type == 'LB') {
                  value = valueSeqno;
                }

                let prmNo = result[i].prmNo;
                let prmDes = result[i].prmDes;

                let param_parametre_resultat1 = {
                  prmNo: prmNo,
                  prmDes: prmDes,
                  valueSeqno: valueSeqno,
                  value: value,
                  valueDes: valueDes,
                };

                parametre.push(param_parametre_resultat1);
              }

              if (result[i].type == 'DF') {
                let value = result[i].defValue;
                let valueDes = result[i].defValue;
                let valueSeqno = 1;
                let prmNo = result[i].prmNo;
                let prmDes = result[i].prmDes;
                let param_parametre_resultat2 = {
                  prmNo: prmNo,
                  prmDes: prmDes,
                  valueSeqno: valueSeqno,
                  value: value,
                  valueDes: valueDes,
                };
                parametre.push(param_parametre_resultat2);
              }
            } else {
              for (let j = 0; j < result[i].nValues.length; i++) {
                if (result[i].defValue == result[i].nValues[j].value) {
                  let value = result[i].nValues[j].value;
                  let valueSeqno;
                  let valueDes;

                  if (result[i].nValues[j].valueSeqno == null) {
                    valueSeqno = 1;
                  } else {
                    valueSeqno = result[i].nValues[j].valueSeqno;
                  }

                  if (result[i].nValues[j].valueDes == null) {
                    valueDes = result[i].nValues[j].value;
                  } else {
                    valueDes = result[i].nValues[j].valueDes;
                  }

                  if (result[i].type == 'LB') {
                    value = valueSeqno;
                  }

                  var prmNo = result[i].prmNo;
                  var prmDes = result[i].prmDes;
                  var param_parametre_resultat3 = {
                    prmNo: prmNo,
                    prmDes: prmDes,
                    valueSeqno: valueSeqno,
                    value: value,
                    valueDes: valueDes,
                  };
                  parametre.push(param_parametre_resultat3);
                }
              }

              // Si le parametre en question dispose du type DF donc, on ne prend pas les nvalue mais le textareo qui dispose d'une valeur par défaut
              if (result[i].type == 'DF') {
                var value = result[i].defValue;
                var valueDes = result[i].defValue;
                var valueSeqno = 1;
                var prmNo = result[i].prmNo;
                var prmDes = result[i].prmDes;
                var param_parametre_resultat4 = {
                  prmNo: prmNo,
                  prmDes: prmDes,
                  valueSeqno: valueSeqno,
                  value: value,
                  valueDes: valueDes,
                };
                parametre.push(param_parametre_resultat4);
              }
            }
          }
        }
      }

      let resultat_via_service = {
        sncode: sncode,
        spcode: spcode,
        servicename: servicename,
        parametre: parametre,
      };
      this.listServices.push(resultat_via_service);
    } else {
      if (result[0].defValue) {
        if (!Array.isArray(result[0].nValues)) {
          if (result[0].defValue == result[0].nValues.value) {
            let value = result[0].nValues.value;
            let valueSeqno;
            let valueDes;

            if (result[0].nValues.valueSeqno == null) {
              valueSeqno = 1;
            } else {
              valueSeqno = result[0].nValues.valueSeqno;
            }

            if (result[0].nValues.valueDes == null) {
              valueDes = result[0].nValues.value;
            } else {
              valueDes = result[0].nValues.valueDes;
            }

            if (result[0].type == 'LB') {
              value = valueSeqno;
            }

            let prmNo = result[0].prmNo;
            let prmDes = result[0].prmDes;
            let param_parametre_resultat = {
              prmNo: prmNo,
              prmDes: prmDes,
              valueSeqno: valueSeqno,
              value: value,
              valueDes: valueDes,
            };
            parametre.push(param_parametre_resultat);
          }

          if (result[0].type == 'DF') {
            let value = result[0].defValue;
            let valueDes = result[0].defValue;
            let valueSeqno = 1;
            let prmNo = result[0].prmNo;
            let prmDes = result[0].prmDes;
            let param_parametre_resultat = {
              prmNo: prmNo,
              prmDes: prmDes,
              valueSeqno: valueSeqno,
              value: value,
              valueDes: valueDes,
            };
            parametre.push(param_parametre_resultat);
          }
        } else {
          for (let j = 0; j < result[0].nValues.length; j++) {
            if (result[0].defValue == result[0].nValues[j].value) {
              let value = result[0].nValues[j].value;
              let valueSeqno;
              let valueDes;

              if (result[0].nValues[j].valueSeqno == null) {
                valueSeqno = 1;
              } else {
                valueSeqno = result[0].nValues[j].valueSeqno;
              }

              if (result[0].nValues[j].valueDes == null) {
                valueDes = result[0].nValues[j].value;
              } else {
                valueDes = result[0].nValues[j].valueDes;
              }

              if (result[0].type == 'LB') {
                value = valueSeqno;
              }

              let prmNo = result[0].prmNo;
              let prmDes = result[0].prmDes;
              let param_parametre_resultat = {
                prmNo: prmNo,
                prmDes: prmDes,
                valueSeqno: valueSeqno,
                value: value,
                valueDes: valueDes,
              };
              parametre.push(param_parametre_resultat);
            }

            if (result[0].type == 'DF') {
              let value = result[0].defValue;
              let valueDes = result[0].defValue;
              let valueSeqno = 1;
              let prmNo = result[0].prmNo;
              let prmDes = result[0].prmDes;
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
      }
    }

    let resultat_via_service = {
      sncode: sncode,
      spcode: spcode,
      servicename: servicename,
      parametre: parametre,
    };
    this.listServices.push(resultat_via_service);
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
      idUtilisateur: this.storageService.getItem('user_id'),
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
      idAction: 3,
      etat: 'PENDING',
      lblAction: 'Désactivation',
      lbl_etape: 'En attente de validation métier',
    };
    this.acteMasseService.saveDesactivation(data).subscribe({
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
      },
    });
  }

  clear(): void {
    this.inputFile.nativeElement.value = '';
    this.fichier = '';
    this.nbLigne = '';
    this.nbrError = '';
    this.checkDate = false;
  }
}
