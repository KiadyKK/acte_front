import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-resume',
  templateUrl: './modal-resume.component.html',
  styleUrls: ['./modal-resume.component.css']
})
export class ModalResumeComponent {
  @Input() nbLigne: any;
  @Input() nbrError: any;

  constructor(public activeModal: NgbActiveModal) {}
}
