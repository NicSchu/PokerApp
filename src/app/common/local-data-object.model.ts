/**
 * Created by Sebastian on 05.07.2017.
 */
export class LocalDataObject {
  constructor(public useCustomOptions : boolean, //(this boolean determines whether to use the user´s custom client options or not;this variable is set @clientOptions-page.component.ts
              public cardbackAppearance : string, //(this string is "ShowOthersCardbacks" or "ShowOnlyMyCardback".The value determines whether the user wants to see the other players cardbacks or not.;this variable is set @clientOptions-page.component.ts)
              public clientColorHexcode : string){} //(this string looks like "#fff000" and determines the color of several <navbar> tags.;this variable is set @clientOptions-page.component.ts)
}
