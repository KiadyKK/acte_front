import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-resume-ajout',
  templateUrl: './modal-resume-ajout.component.html',
  styleUrls: ['./modal-resume-ajout.component.css']
})
export class ModalResumeAjoutComponent {
  @Input() services: any;
  @Input() nbLigne: any;
  @Input() nbrError: any;

  constructor(public activeModal: NgbActiveModal) {}
}
