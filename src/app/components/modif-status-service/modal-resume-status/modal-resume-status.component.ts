import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-resume-status',
  templateUrl: './modal-resume-status.component.html',
  styleUrls: ['./modal-resume-status.component.css']
})
export class ModalResumeStatusComponent {
  @Input() services: any;
  @Input() nbLigne: any;
  @Input() nbrError: any;
  @Input() status: string;

  constructor(public activeModal: NgbActiveModal) {}
}
