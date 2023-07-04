import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-resume-plan',
  templateUrl: './modal-resume-plan.component.html',
  styleUrls: ['./modal-resume-plan.component.css'],
})
export class ModalResumePlanComponent {
  @Input() nbLigne: any;
  @Input() nbrError: any;
  @Input() servicesAdded: Object;
  @Input() servicesRemoved: Object;

  constructor(public activeModal: NgbActiveModal) {}
}
