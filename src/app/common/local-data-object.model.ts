/**
 * Created by Sebastian on 05.07.2017.
 */
export class LocalDataObject {
  constructor(public useCustomOptions : boolean, //(this boolean determines whether to use the user´s custom client options or not
                                                 // ;this variable is set @clientOptions-page.component.ts

              public cardbackAppearance : string, //(this string is "ShowOthersCardbacks" or "ShowOnlyMyCardback".The value determines whether the user wants to see the other players cardbacks or not.
                                                  // ;this variable is set @clientOptions-page.component.ts)

              public clientColor : string,//(this string looks like "primary" and determines the color of several <navbar> tags.;this variable is set @clientOptions-page.component.ts)
                                          // for the color definitions look @src/theme/variables.scss in $colors{}

              public colorPickerValue : number){}  //(this number represents the value, the colorPickerRange on @clientOptions-page.component.ts has.
                                                   // ;this variable is set @clientOptions-page.component.ts)
}
