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
  var label1 = document.createElement("ion-label");
  label1.innerHTML = t;
  ionItem1.appendChild(label1);

  var iframe = document.createElement("iframe");
  iframe.src = l;
  iframe.frameBorder = "0";
  iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen;
  iframe.style.cssText = 'width:50%;height:100%;margin-left:25%'
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
