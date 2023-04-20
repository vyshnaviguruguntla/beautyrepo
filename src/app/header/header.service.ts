import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private approvalStageMessage = new Subject();
  currentApprovalStageMessage = this.approvalStageMessage.asObservable();

  constructor() { }

  updateApprovalMessage(message: string) {
    console.log("message:",message);
    this.approvalStageMessage.next(message)
  }

}
