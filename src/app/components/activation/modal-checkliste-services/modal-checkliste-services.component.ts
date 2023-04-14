import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-checkliste-services',
  templateUrl: './modal-checkliste-services.component.html',
  styleUrls: ['./modal-checkliste-services.component.css']
})
export class ModalChecklisteServicesComponent {
  @Input() services: any;

  constructor(
    public activeModal: NgbActiveModal
  ) { }
}
