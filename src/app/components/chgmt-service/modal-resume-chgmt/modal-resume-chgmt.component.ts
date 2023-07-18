import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-modal-resume-chgmt',
  templateUrl: './modal-resume-chgmt.component.html',
  styleUrls: ['./modal-resume-chgmt.component.css']
})
export class ModalResumeChgmtComponent {
  @Input() oldServices: any;
  @Input() services: any;
  @Input() nbLigne: any;
  @Input() nbrError: any;

  constructor(public activeModal: NgbActiveModal) {}
}
