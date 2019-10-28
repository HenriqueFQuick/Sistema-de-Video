import { Component, Query, OnInit } from '@angular/core';
import { NavController, LoadingController, ModalController, AlertController, IonCard, IonLabel, DomController, ToastController } from '@ionic/angular';
import { Empresa } from './Empresa';
import { stringify } from 'querystring';
import { Validators,FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public static count : number = localStorage.length;
  
  public form : FormGroup;

  public titulo : string = "";
  public link : string = "";
  public descricao : string = "";

  constructor(public navCtrl : NavController, private fb : FormBuilder, private loadingCtrl : LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public toastController : ToastController) {
    this.form = this.fb.group(
      {
        Titulo : ['', Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(50),
          Validators.required
        ])],
        Link : ['', Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(50),
          Validators.required
        ])],
        Descricao : ['', Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(250),
          Validators.required
        ])],
      }
    );
  }

  async ngOnInit(){

    //localStorage.clear();
    
    let loader = await this.loadingCtrl.create({
      message: "Please wait...",
      spinner: "bubbles"
    });
    loader.present();

    for(var element in localStorage){
      var obj : Empresa = JSON.parse(localStorage.getItem(element));
      if(obj != null){
        obj.Link = this.modificaLink(obj.Link);
        this.criaHTML2(obj.Titulo, obj.Link, obj.Descricao,obj.id);
      }
    }

    loader.dismiss();
  }


cancel() : void{
  this.apagar();
  window.location.reload();
}

apagar(){
  this.form.setValue({
    Titulo: " ",
    Link: " ",
    Descricao: " "
  })
}

async excluir(){
  let loader = await this.loadingCtrl.create({
    message: "Please wait...",
    spinner: "bubbles"
  });
  loader.present();

    localStorage.clear()
    
  loader.dismiss();
  window.location.reload();
}

atualizar(id: string,t : string, l : string, d: string) :any{
  l = this.modificaLink(l);
  this.criaAlertAtualizar(t,l,d, id);
}

atualizaFinal(data, id){
  data.Link = this.modificaLink(data.Link);

  var obj : Empresa = new Empresa(id,data.Titulo,data.Link,data.Descricao);

  localStorage.setItem(id, JSON.stringify(obj));
  this.criaHTML2(obj.Titulo, obj.Link, obj.Descricao, id);

  window.location.reload()
}

async submit() : Promise<void>{
    this.titulo = this.form.value.Titulo.toString().trimLeft();
    this.link = this.form.value.Link.toString().trimLeft();
    this.descricao = this.form.value.Descricao.toString().trimLeft();

    this.link = this.modificaLink(this.link);
    HomePage.count = HomePage.count + 1;
    
    var obj2 : Empresa = new Empresa(HomePage.count.toString(),this.titulo,this.link,this.descricao);

    localStorage.setItem(HomePage.count.toString() , JSON.stringify(obj2));
    this.criaHTML2(obj2.Titulo, obj2.Link, obj2.Descricao, obj2.id);
    
    this.apagar();
  
}

modificaLink(link : string) : string{
  return link.replace("watch?v=", "embed/");
}

async buscarTitulo(tag : string){
  var tags :string[] = []
  for(var element in localStorage){
    var obj : Empresa = JSON.parse(localStorage.getItem(element));
    if(obj != null){
      if((obj.Titulo).includes(tag)){
        tags.push(obj.Titulo)
      }
    }
  }
  alert(tags.join('\n\n'))
}



async criaAlertAtualizar(t : string, l : string, d: string,id:string){
  let prompt = this.alertCtrl.create({
    header: "Autenticar",
    message: "Informe seus dados para se autenticar no sistema",
    inputs:[
      {name: "Titulo",type: "text",value: t},
      {name: "Link",type: "text",value: l},
      {name: "Descricao",type: "text", value: d}
    ],
    buttons:[
      {
        text: "Atualizar", handler: (data)=>{
          this.atualizaFinal(data,id);
        }
      }
    ]
  });
  (await prompt).present();
}


criaHTML2(t : string, l : string, d: string, id : string){
  var ionCard = document.createElement('ion-card');
  ionCard.id = id
  var ionCardContent = document.createElement('ion-card-content');
  ionCard.appendChild(ionCardContent);
  var ionItem1 = document.createElement("ion-item");
  ionCardContent.appendChild(ionItem1);

  var thumb = document.createElement("ion-avatar");
  thumb.className = "item-start";
  var img = document.createElement("img");
  img.src = "data:image/jpeg;base64,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";
  thumb.appendChild(img);
  ionItem1.appendChild(thumb);

  var label1 = document.createElement("ion-label");
  label1.style.cssText = "margin-left: 5%;"
  label1.innerHTML = t;
  ionItem1.appendChild(label1);

  var iframe = document.createElement("iframe");
  iframe.src = l;
  iframe.frameBorder = "0";
  iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen;
  iframe.style.cssText = 'width:50%;height:100%'
  ionCardContent.appendChild(iframe);

  var ionItem3 = document.createElement("ion-item");
  ionCardContent.appendChild(ionItem3);
  var label3 = document.createElement("ion-label");
  label3.style.cssText = 'height:60%;white-space:pre-wrap;overflow-y:scroll'
  label3.innerHTML = d;
  ionItem3.appendChild(label3);

  var btn = document.createElement("ion-button");
  ionCardContent.appendChild(btn);
  btn.innerHTML = "Excluir";
  btn.onclick = function(){
    localStorage.removeItem(ionCard.id.toString());
    ionCard.remove();
  };

  var btn2 = document.createElement("ion-button");
  ionCardContent.appendChild(btn2);
  btn2.innerHTML = "Atualizar";
  btn2.onclick =  () => {
    this.atualizar(ionCard.id,t,l,d)
  };

  document.querySelector("#div1").appendChild(ionCard);
}
}
