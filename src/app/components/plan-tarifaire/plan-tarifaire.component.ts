import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActeMasseService } from 'src/app/services/acteMasse/acte-masse.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ModalSavingComponent } from 'src/app/shared/modal-saving/modal-saving.component';
import { ModalResumePlanComponent } from './modal-resume-plan/modal-resume-plan.component';

@Component({
  selector: 'app-plan-tarifaire',
  templateUrl: './plan-tarifaire.component.html',
  styleUrls: ['./plan-tarifaire.component.css'],
})
export class PlanTarifaireComponent {
  @ViewChild('inputFile')
  inputFile: ElementRef;

  private selectedFile: File | null;

  public rateplans: any;
  public newRateplans: any;
  public selectedRateplans: any;
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
  public newServiceRateplans: any;
  public sortServicesRemoved: Object;

  public service: any;

  page = 1;
  pageSize = 4;

  constructor(
    private storageService: StorageService,
    private acteMasseService: ActeMasseService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.acteMasseService.getChangeRateplansRead().subscribe({
      next: (data) => {
        const { changeRatePlans, allRatePlans } = data;

        let mergeRatePlans: Array<any> = allRatePlans.filter(
          (allRatePlan: any) => {
            return changeRatePlans.some((changeRatePlan: any) => {
              return allRatePlan.rpcode === changeRatePlan.rpcode;
            });
          }
        );

        this.rateplans = mergeRatePlans.sort((a: any, b: any) => {
          return a.rpDes.localeCompare(b.rpDes);
        });
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
              id_action: 10,
              msisdn: listeMsisdn,
              fichier: this.selectedFile!.name,
            };
            this.acteMasseService.verifyPlantarifaire(data).subscribe({
              next: (data) => {
                if (data.hasOwnProperty('liste')) {
                  let services: Array<any> = [];
                  const listes: Array<any> = data.liste;
                  listes.forEach(
                    (liste: any) => (services = services.concat(liste.service))
                  );

                  let listeFiltered: Array<number> = [...new Set(services)];

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
                            let dataFiltered = data.filter(
                              (item: any) =>
                                listeFiltered.indexOf(item.sncode) > -1
                            );

                            let result = dataFiltered.reduce(
                              (acc: any, cur: any) => {
                                acc[cur.nom_package] =
                                  acc[cur.nom_package] || [];
                                acc[cur.nom_package].push(cur);
                                return acc;
                              },
                              {}
                            );

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

  onRatePlansChange(): void {
    const { rpcode, rpVscode, rpDes } = this.selectedRateplans;
    this.newRateplans = { rpcode, rpVscode, rpDes };

    this.acteMasseService.getServiceRateplans(rpcode, rpVscode).subscribe({
      next: (data) => {
        if (data.length) {
          let dataFiltered = data.filter(
            (item: any) => item.svCsind === 'true'
          );

          let result = dataFiltered.reduce((acc: any, cur: any) => {
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

          this.newServiceRateplans = resultSorted;
        } else {
          alert('Aucun service pour ce plan tarifaire');
        }
      },
    });
  }

  disableValider(): boolean {
    return this.fichier === '' ||
      !this.checkratePlans ||
      this.description === '' ||
      this.commentaire === ''
      ? true
      : false;
  }

  valider(): void {
    let sncode: Array<number> = [];
    this.mergeServices(this.sortServicesRemoved).forEach((item: any) =>
      sncode.push(item.sncode)
    );

    let data: any = {
      initiateur: this.storageService.getItem('trigramme'),
      idUtilisateur: +this.storageService.getItem('user_id'),
      plan_tarifaire: this.newRateplans,
      comment: this.commentaire,
      service: {
        rpcode: this.ratePlans.rpcode,
        sncode: sncode,
      },
      listeMsisdn: {
        fichier: this.fichier,
        nbLigne: this.nbLigne,
        nb_erreur: this.nbrError,
        liste: this.contenu,
      },
      descript_court: this.description,
      idAction: 10,
      etat: 'PENDING',
      lblAction: 'Modification plan tarifaire',
      lbl_etape: 'En attente de validation métier',
    };

    const formData: FormData = new FormData();
    formData.append('file', this.selectedFile!);
    formData.append('data', JSON.stringify(data));

    this.acteMasseService.savePlanTarifaire(formData).subscribe({
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
    this.fichier = '';
    this.selectedRateplans = '';
    this.serviceRateplans = [];
    this.newServiceRateplans = [];
    this.listServices = [];
    this.nbLigne = '';
    this.nbrError = 0;
  }

  openModalResume() {
    let serviceRateplans: Array<any> = this.mergeServices(
      this.serviceRateplans
    );

    let newServiceRateplans: Array<any> = this.mergeServices(
      this.newServiceRateplans
    );

    let servicesAdded: Array<any> = this.compareServices(
      newServiceRateplans,
      serviceRateplans
    );

    let servicesRemoved: Array<any> = this.compareServices(
      serviceRateplans,
      newServiceRateplans
    );

    let sortServicesAdded: Object = this.sortServices(servicesAdded);

    this.sortServicesRemoved = this.sortServices(servicesRemoved);

    const modalRef = this.modalService.open(ModalResumePlanComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.services = this.listServices;
    modalRef.componentInstance.nbLigne = this.nbLigne;
    modalRef.componentInstance.nbrError = this.nbrError;
    modalRef.componentInstance.servicesAdded = sortServicesAdded;
    modalRef.componentInstance.servicesRemoved = this.sortServicesRemoved;
  }

  mergeServices(services: any): Array<any> {
    let servicesMerged: Array<any> = [];
    for (const key in services) {
      servicesMerged = servicesMerged.concat(services[key]);
    }
    return servicesMerged;
  }

  compareServices(services1: Array<any>, services2: Array<any>): Array<any> {
    return services1.filter((newServiceRateplan: any) => {
      return !services2.some((serviceRateplan: any) => {
        return newServiceRateplan.sncode === serviceRateplan.sncode;
      });
    });
  }

  sortServices(data: Array<any>): Object {
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

    return resultSorted;
  }
}
