/**
 * Created by sebb9 on 08.06.2017.
 */

//TODO - nachfrage, ob wir eine Kategorie einführen sollen!
export class Achievement {

  constructor(public id?: string,
              public name?: string,
              public description?: string,
              public points? :number,
              public accomplished?: boolean,
              public category? : string,
              public reward? : number) {

  }



  public static createWith(achievement : any) : Achievement {
    return Object.assign(new Achievement(), achievement);
  }
}
