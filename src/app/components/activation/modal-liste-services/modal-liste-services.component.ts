import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-liste-services',
  templateUrl: './modal-liste-services.component.html',
  styleUrls: ['./modal-liste-services.component.css']
})
export class ModalListeServicesComponent {
  @Input() services: any;
  @Input() selectedRateplans: any;

  constructor(
    public activeModal: NgbActiveModal
  ) { }
}
