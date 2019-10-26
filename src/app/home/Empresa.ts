import { OnInit } from '@angular/core';

export class Empresa implements OnInit {

    id : string;
    Titulo : string; 
    Link : string;
    Descricao : string;

    constructor(id : string,titulo : string, link : string, descricao: string){
        this.id = id;
        this.Titulo = titulo;
        this.Link = link;
        this.Descricao = descricao;
    }

    ngOnInit(): void {

    }
}