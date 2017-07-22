/**
 * Created by Sebastian on 22.07.2017.
 */
export class ClientOptionsConstants {

  constructor() {

  }

  public static colorNames = //Take a look at src/theme/variables.scss
  [
    'rainbowRedOne',
    'rainbowOrange',
    'rainbowYellowOne',
    'rainbowYellowTwo',
    'rainbowGreenOne',
    'rainbowGreenTwo',
    'rainbowGreenThree',
    'rainbowTurquoiseOne',
    'rainbowTurquoiseTwo',
    'rainbowTurquoiseThree',
    'rainbowBlueOne',
    'rainbowBlueTwo',
    'rainbowBlueThree',
    'rainbowBlueFour',
    'rainbowPurpleOne',
    'rainbowPurpleTwo',
    'rainbowPinkOne',
    'rainbowPinkTwo',
    'rainbowPinkThree',
    'rainbowPinkFour',
    'rainbowRedTwo'
  ];

  //white is nearly invisible in front of a yellow background -> we need to adjust the text color for each color
  public static colorNameToTextColor = //Maps are available ECMA6+ - we are using ECMA5
    {
      'rainbowRedOne' : 'light',
      'rainbowOrange': 'light',
      'rainbowYellowOne': 'light',
      'rainbowYellowTwo': 'dark',
      'rainbowGreenOne': 'dark',
      'rainbowGreenTwo': 'dark',
      'rainbowGreenThree': 'dark',
      'rainbowTurquoiseOne': 'dark',
      'rainbowTurquoiseTwo': 'dark',
      'rainbowTurquoiseThree': 'dark',
      'rainbowBlueOne': 'dark',
      'rainbowBlueTwo': 'light',
      'rainbowBlueThree': 'light',
      'rainbowBlueFour': 'light',
      'rainbowPurpleOne': 'light',
      'rainbowPurpleTwo': 'light',
      'rainbowPinkOne': 'light',
      'rainbowPinkTwo': 'light',
      'rainbowPinkThree': 'light',
      'rainbowPinkFour': 'light',
      'rainbowRedTwo': 'light'
    };


}
