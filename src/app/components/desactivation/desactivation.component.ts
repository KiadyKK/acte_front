import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActeMasseService } from 'src/app/services/acteMasse/acte-masse.service';
import { SoapService } from 'src/app/services/soap/soap.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-desactivation',
  templateUrl: './desactivation.component.html',
  styleUrls: ['./desactivation.component.css'],
})
export class DesactivationComponent implements OnInit {
  @ViewChild('inputFile')
  inputFile: ElementRef;

  public reasons: any;
  public date: Date = new Date();
  public format = 'dd/MM/yyyy HH:mm:ss';
  public checkDate: boolean = false;
  public description: string = '';
  public commentaire: string = '';
  public nbLigne: number;
  public contenu: Array<any> = [];
  public fichier: string = '';
  public nbrError: number;
  public selectedReason: any;
  public listeMsisdn: Array<any>;

  constructor(
    private soapService: SoapService,
    private storageService: StorageService,
    private acteMasseService: ActeMasseService
  ) {}

  ngOnInit(): void {
    this.soapService.getReasonsRead().subscribe({
      next: (data) => {
        this.reasons = data;
      },
    });
  }

  onFileChange(event: any) {
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
          this.soapService.verifydesactivation(data).subscribe({
            next: (data) => {
              if (data.hasOwnProperty('liste')) {
                this.contenu = data.liste;
                this.fichier = file.name;
                this.nbLigne = data.liste.length;
                this.nbrError = data.nb_erreur;
              } else {
                let msisdn: string = '\n';
                data.forEach((element: string) => {
                  msisdn += '- ' + element + '\n';
                });
                this.inputFile.nativeElement.value = '';
                alert('Msisdn incorrecte :' + msisdn);
              }
            },
          });
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
      date_prise: this.checkDate ? this.date : null,
      listeMsisdn: this.listeMsisdn,
      fichier: this.fichier,
      nbLigne: this.nbLigne,
      rsCode: this.selectedReason.rsCode,
      rsDes: this.selectedReason.rsDes,
      descript_court: this.description,
      checkdateprise: this.checkDate,
    };
    this.acteMasseService.saveDesactivation(data).subscribe({
      next: (data) => {
        console.log(data);
      },
    });
  }
}
