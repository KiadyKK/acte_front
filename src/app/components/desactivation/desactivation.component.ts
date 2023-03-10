import { Component, OnInit } from '@angular/core';
import { SoapService } from 'src/app/services/soap/soap.service';

@Component({
  selector: 'app-desactivation',
  templateUrl: './desactivation.component.html',
  styleUrls: ['./desactivation.component.css'],
})
export class DesactivationComponent implements OnInit {
  reasons: any;
  public value: Date = new Date();
  public format = 'MM/dd/yyyy HH:mm:ss';
  public checkDate: boolean = false;
  public description: string;
  public commentaire: string;
  public nbrLigne: number;

  constructor(private soapService: SoapService) {}

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
        this.nbrLigne = 0;
        let duplicates: Array<any> = this.findDuplicates(allTextLines, true);
        let listeMsisdn: Array<any> = this.findDuplicates(allTextLines, false);
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
          let data: any = {
            id_action: 3,
            msisdn: listeMsisdn,
            fichier: file.name,
          };
          this.soapService.verifydesactivation(data).subscribe({
            next: (data) => {
              console.log(data);
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
}
