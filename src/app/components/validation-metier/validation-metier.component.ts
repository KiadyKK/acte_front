import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Interaction } from 'src/app/models/interaction.model';
import { MetierService } from 'src/app/services/metier/metier.service';
import { ModalSavingComponent } from 'src/app/shared/modal-saving/modal-saving.component';
import { ModalLogComponent } from './modal-log/modal-log.component';
import { ModalRejectComponent } from './modal-reject/modal-reject.component';
import { ModalRetourCxComponent } from './modal-retour-cx/modal-retour-cx.component';
import { ModalValidationComponent } from './modal-validation/modal-validation.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-validation-metier',
  templateUrl: './validation-metier.component.html',
  styleUrls: ['./validation-metier.component.css'],
})
export class ValidationMetierComponent implements OnInit {
  public apiUrl: string = environment.apiUrl;
  public date: Date = new Date();
  public comValidateur: string;
  public content: Interaction = new Interaction();

  constructor(
    private metierService: MetierService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.onActeClick(this.route.snapshot.params['id']);
  }

  onActeClick(idActe: number): void {
    this.metierService.afficherInteraction(idActe).subscribe({
      next: (data: Interaction) => {
        this.content = data;
        this.date = new Date(data.date_prise_compte!);
        this.comValidateur = data.commentaire!;
      },
    });
  }

  rejeter(): void {
    const modalRef = this.modalService.open(ModalRejectComponent, {
      windowClass: 'modal-reject',
      centered: true,
    });
    modalRef.result.then(
      (res) => {
        let data: any = {
          id: this.content.idActe,
          comment: this.comValidateur,
        };
        this.metierService.rejeter(data).subscribe({
          next: (data) => {
            if (data > 0) {
              this.openModalSaving(null, 0);
              this.onActeClick(this.content.idActe);
            } else {
              this.openModalSaving(data, 0);
            }
          },
        });
      },
      (dismiss) => {}
    );
  }

  openModalSaving(error: string | null = null, type: number = 1) {
    const modalRef = this.modalService.open(ModalSavingComponent, {
      size: 'sm',
      centered: true,
    });
    modalRef.componentInstance.error = error;
    modalRef.componentInstance.type = type;
  }

  valider(): void {
    let date_prise_old: Date = new Date(this.content.date_prise_compte!);
    let date_prise_new: any = date_prise_old >= this.date ? null : this.date;

    let validForm: any =
      this.content.checkdatepriseencompte === 'false'
        ? new Date()
        : this.content.date_prise_compte?.replace(' ', 'T');
    switch (this.content.idAction) {
      //NOUVELLE ACTIVATION***************************************
      case 1:
        let data1: any = {
          id: this.content.idActe,
          listeMsisdn: this.content.input.liste,
          validForm: validForm,
          titre: 'Nouvelle activation',
          checkdatepriseencompte: this.content.checkdatepriseencompte,
          comment: this.comValidateur,
        };
        this.metierService.validerJoker(data1).subscribe({
          next: (data) => {
            if (!data.msisdnError.length) {
              this.openModalValidation(false);
            } else {
              this.openModalValidation(true);
            }
            this.onActeClick(this.content.idActe);
          },
        });

        break;

      //MODIFICATION INFO CLIENT***************************************
      case 2:
        let data2: any = {
          id: this.content.idActe,
          listeMsisdn: this.content.input.liste,
          titre: 'Modification Info-client',
          comment: this.comValidateur,
        };
        this.metierService.validerJoker(data2).subscribe({
          next: (data) => {
            console.log(data);
            if (!data.msisdnError.length) {
              this.openModalValidation(false);
            } else {
              this.openModalValidation(true);
            }
            this.onActeClick(this.content.idActe);
          },
        });

        break;

      //DESACTIVATION*********************************************
      case 3:
        let data3: any = {
          id: this.content.idActe,
          listeMsisdn: this.content.input.liste,
          validForm: validForm,
          rsCode: this.content.id_reutilisable,
          titre: 'Désactivation',
          checkdatepriseencompte: this.content.checkdatepriseencompte,
          comment: this.comValidateur,
          date_prise_new: date_prise_new,
          type: 2,
        };
        this.metierService.validerJoker(data3).subscribe({
          next: (data) => {
            if (!data.msisdnError.length) {
              this.openModalValidation(false);
            } else {
              this.openModalValidation(true);
            }
            this.onActeClick(this.content.idActe);
          },
        });

        break;

      //LIMIT CONSO*********************************************
      case 4:
        let data4: any = {
          id: this.content.idActe,
          listeMsisdn: this.content.input.liste,
          validForm: validForm,
          rsCode: this.content.id_reutilisable,
          titre: 'Limit Consommation',
          checkdatepriseencompte: this.content.checkdatepriseencompte,
          comment: this.comValidateur,
          date_prise_new: date_prise_new,
          type: 2,
        };
        // this.metierService.validerJoker(data4).subscribe({
        //   next: (data) => {
        //     if (!data.msisdnError.length) {
        //       this.openModalValidation(false);
        //     } else {
        //       this.openModalValidation(true);
        //     }
        //     this.onActeClick(this.content.idActe);
        //   },
        // });

        break;
      //TAKE OVER*********************************************
      case 6:
        let data6: any = {
          id: this.content.idActe,
          listeMsisdn: this.content.input.liste,
          validForm: validForm,
          csCode: this.content.custcode.custcode,
          csId: this.content.custcode.csId,
          csIdPub: this.content.custcode.csIdPub,
          rsCode: this.content.id_reutilisable,
          titre: 'Take Over',
          checkdatepriseencompte: this.content.checkdatepriseencompte,
          comment: this.comValidateur,
        };
        // this.metierService.validerJoker(data6).subscribe({
        //   next: (data) => {
        //     if (!data.msisdnError.length) {
        //       this.openModalValidation(false);
        //     } else {
        //       this.openModalValidation(true);
        //     }
        //     this.onActeClick(this.content.idActe);
        //   },
        // });

        break;

      //REENGAGEMENT*********************************************
      case 7:
        let data7: any = {
          id: this.content.idActe,
          listeMsisdn: this.content.input.liste,
          sncode: this.content.service_param[0].sncode,
          validForm: validForm,
          titre: 'Reengagement',
          checkdatepriseencompte: this.content.checkdatepriseencompte,
          comment: this.comValidateur,
        };
        // this.metierService.validerJoker(data6).subscribe({
        //   next: (data) => {
        //     if (!data.msisdnError.length) {
        //       this.openModalValidation(false);
        //     } else {
        //       this.openModalValidation(true);
        //     }
        //     this.onActeClick(this.content.idActe);
        //   },
        // });

        break;

      //SUSPENSION*********************************************
      case 12:
        let data12: any = {
          id: this.content.idActe,
          listeMsisdn: this.content.input.liste,
          validForm: validForm,
          rsCode: this.content.id_reutilisable,
          titre: 'Suspension',
          checkdatepriseencompte: this.content.checkdatepriseencompte,
          comment: this.comValidateur,
          date_prise_new: date_prise_new,
        };
        // this.metierService.validerJoker(data12).subscribe({
        //   next: (data) => {
        //     if (!data.msisdnError.length) {
        //       this.openModalValidation(false);
        //     } else {
        //       this.openModalValidation(true);
        //     }
        //     this.onActeClick(this.content.idActe);
        //   },
        // });

        break;
      default:
        break;
    }
  }

  openModalValidation(error: boolean) {
    const modalRef = this.modalService.open(ModalValidationComponent, {
      size: 'sm',
      centered: true,
    });
    modalRef.componentInstance.error = error;
  }

  afficherLog(): void {
    this.metierService.afficherLog(this.content.idActe).subscribe({
      next: (data) => {
        const modalRef = this.modalService.open(ModalLogComponent, {
          size: 'lg',
          centered: true,
        });
        modalRef.componentInstance.logs = data;
      },
    });
  }

  afficherRetour(): void {
    this.metierService.afficherRetourCX(this.content.idActe).subscribe({
      next: (data) => {
        const modalRef = this.modalService.open(ModalRetourCxComponent, {
          size: 'lg',
          centered: true,
        });
        modalRef.componentInstance.jobids = data;
      },
    });
  }
}
