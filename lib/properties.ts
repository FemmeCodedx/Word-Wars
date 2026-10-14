export const properties = [
'Mansion Estate','Condo Blvd','Renters Row','High Rise Central','Underground Hub','Transplant Plaza','Doctors Drive','Surgeons Capital',
'Penthouse Place','Garden Terrace','Skyline Avenue','Harbor Heights','Founders Square','Maple Court','Cedar Crescent','Oakwood Lane',
'Riverside Walk','Lakeview Landing','Sunset Strip','Starlight Street','Golden Gate','Silver Springs','Emerald Avenue','Ruby Road',
'Victory Corner','Scholar Street','Library Lane','Campus Court','Inventors Way','Creators Crescent','Gallery Gardens','Theater Terrace',
'Melody Mews','Rhythm Road','Harmony Heights','Festival Fields','Champions Circle','Arena Avenue','Stadium Street','Courtside Commons',
'Icehouse Lane','Ballpark Place','Market Mews','Bakers Boulevard','Coffee Corner','Orchard Outlook','Meadow Mile','Parkside Place','Crown Plaza'];
// 48 claimable spaces around a square, plus one central landmark: 49 total.
export function propertyPosition(index:number){if(index<13)return {gridRow:1,gridColumn:index+1};if(index<25)return {gridRow:index-11,gridColumn:13};if(index<37)return {gridRow:13,gridColumn:37-index};return {gridRow:49-index,gridColumn:1};}
