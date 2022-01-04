import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormDataParserService {

  constructor() { }

  generate(model: any, form?: FormData, log?:boolean){
    const _formData: FormData =  Utility.convertModelToFormData(model,form)

    return _formData;
  }
}


class Utility {
  public static modifyFormWithModel(model:any, form:FormData): FormData{
    return this.convertModelToFormData(model,form);
  }
  public static convertModelToFormData(model: any, form?: FormData ): FormData {
    let formData = form || new FormData();

    for (let prop of Object.keys(model)) {
      console.log('dev log on utility: using prop'+prop);
      if (model[prop] instanceof Array) {
        console.log('dev log on utility: detected array');
        // formData.append(`${prop}`, JSON.stringify(model[prop]));
        model[prop].forEach((p: string)=>{
          formData.append(`${prop}[]`,p)
        })
      }
      else if (typeof model[prop] === 'object' && !(model[prop] instanceof File)){
        console.log('dev log on utility: detected file');
        formData.append(`${prop}`, model[prop],`${model[prop].name}`);
      }
      else{
        console.log('dev log on utility: detected regular field ');
        formData.append(`${prop}`,model[prop])
      }
    }
    return formData;
  }
}
