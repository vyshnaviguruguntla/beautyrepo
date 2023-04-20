import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr: ToastrService) { }
   
  showSuccess(message : string, title: string){
           this.toastr.success(message, title, {
            closeButton : true,
            // positionClass :ToasterPosition.topRight,
            positionClass: 'toast-top-center',
            // disableTimeOut : true
          },);
  }
   
  showError(message: string, title: string){
      this.toastr.error(message, title,{
        closeButton : true,
        positionClass: 'toast-top-center',
        // disableTimeOut : true
      })
  }
   
  showInfo(message: string, title: string){
      this.toastr.info(message, title,{         
        closeButton : true,
        positionClass: 'toast-top-center',
      // disableTimeOut : true
    })
  }
   
  showWarning(message: string, title: string){
      this.toastr.warning(message, title,{
        closeButton : true,
        positionClass: 'toast-top-center',
      // disableTimeOut : true
      })
  }

}
export enum ToasterPosition {
  topRight = 'toast-top-right',
  topLeft = 'toast-top-left',
  bottomRight = 'toast-bottom-right',
  bottomLeft= 'toast-bottom-left',
  topCenter = 'toast-top-center',
  // Other positions you would like
}