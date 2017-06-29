/**
 * Created by sebb9 on 08.06.2017.
 */
export class Achievement {

  constructor(public id: string,
              public name: string,
              public description: string,
              public points :number,
              public accomplished: boolean) {
  }
}
