const rides = [
  { week: 1, day: "Mon", passengers: 0 }, 
  { week: 1, day: "Tue", passengers: 5 },
  { week: 1, day: "Wed", passengers: 3 },
  { week: 1, day: "Thu", passengers: 5 },     
  { week: 1, day: "Fri", passengers: 1 },

  { week: 2, day: "Mon", passengers: 5 },  
  { week: 2, day: "Tue", passengers: 10 },
  { week: 2, day: "Wed", passengers: 8 },
  { week: 2, day: "Thu", passengers: 10 },
  { week: 2, day: "Fri", passengers: 3 },

  { week: 3, day: "Mon", passengers: 6 },
  { week: 3, day: "Tue", passengers: 11 },
  { week: 3, day: "Wed", passengers: 10 },
  { week: 3, day: "Thu", passengers: 10 },
  { week: 3, day: "Fri", passengers: 4 },
];

// vul constante costEffectiveRides met een array met de objecten uit array rides waarvan passengers > 4.
const costEffectiveRides = rides.filter(d => d.passengers > 4);

// de join-operator zorgt er voor, dat zoveel <p> tags worden aangemaakt als nodig is. Maak voor iedere rendabele rit (=cost-effective ride) een alinea aan, waarin je laat zien: de week, de dag van de week en het aantal passagiers. Test je code door het selectie criterium voor de ritten aan te passen.
d3.select("#cerides")
  .selectAll("p")
  .data(costEffectiveRides)
  .join("p")
  .text(d => `Week ${d.week}, ${d.day}: ${d.passengers} passagiers`);

//Scales - Plaats de code van de vorige opdracht achter commentaartekens. Maak voor iedere rendabele rit een symbool aan, dag kan een rechthoek zijn of een cirkel of een auto. Ik heb deze parameters genomen: ieder symbool schuift 100px naar rechts ten opzichte van de vorige. Test de code.


//Axes Plaats de code van de vorige opdracht achter commentaartekens. Maak voor iedere rendabele rit een cirkel aan, waarvan de straal evenredig is aan het aantal passagiers. Ik heb deze parameters genomen: iedere cirkel schuift 100px naar rechts ten opzichte van de vorige, de straal is gelijk aan het aantal passagiers * 4. Test de code.

  
  

  
 
