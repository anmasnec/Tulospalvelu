"use strict";  // pidä tämä ensimmäisenä rivinä
//@ts-check 


let dataSet = data;
console.log(data);

window.onload = function() { 
    
    
    jarjestaData(dataSet);
    let lista = document.getElementById("lista");
    lisaaJoukkueetListaan(lista);

        //asetetaan virhetarkistukset jokaiseen checkboxiin
      let checkboxit = document.querySelectorAll('input[type="checkbox"]');

     for (let c of checkboxit) {
        lisaaKuuntelija(c);
   }

        tarkista_joukkueenNimi();
        tarkista_leimaustavat();
       tarkista_ekanJasenenMaara();
       tarkista_tokanJasenenMaara();
    
  var joukkueenNimi = document.getElementById('inputNimi');
  joukkueenNimi.addEventListener('change', tarkista_joukkueenNimi);

  var ekanJasenenNimi = document.getElementById('inputJasen1');
   ekanJasenenNimi.addEventListener('change', tarkista_ekanJasenenMaara);

   var tokanJasenenNimi = document.getElementById('inputJasen2');
   tokanJasenenNimi.addEventListener('change', tarkista_tokanJasenenMaara);

   var form = document.getElementById('myForm');
   form.addEventListener('submit', submit);


    };


 //Kuuntelija, joka lisää leimaustavan, jos sellainen lomakkeella valitaan. Muuten poistetaan   
function lisaaKuuntelija(c) {
    c.addEventListener("change", function(e) {
        if (e.target.checked ) {
            leimaustavat.add (e.target.value );
        }
        else {
            leimaustavat.delete(e.target.value);
        }
        tarkista_leimaustavat();
    });
}


 // lomake, joka osaa lisätä ja poistaa kenttiä tarpeen mukaan
window.addEventListener("load", function() {
    // dynaaminen lista koko sivun input-elementeistä
    // voisi käyttää myös omaa taulukkoa tms.
    let inputit = document.getElementsByTagName("input");
    inputit[9].addEventListener("input", addNew);


    function addNew(e) {
        // käydään läpi kaikki input-kentät viimeisestä ensimmäiseen
        // järjestys on oltava tämä, koska kenttiä mahdollisesti poistetaan
        // ja poistaminen sotkee dynaamisen nodeList-objektin indeksoinnin
        // ellei poisteta lopusta 
        let viimeinen_tyhja = -1; // viimeisen tyhjän kentän paikka listassa
        for(let i=inputit.length-1 ; i>-1; i--) { // inputit näkyy ulommasta funktiosta
            let input = inputit[i];
            // jos on jo löydetty tyhjä kenttä ja löydetään uusi niin poistetaan viimeinen tyhjä kenttä
            // kenttä on aina label-elementin sisällä eli oikeasti poistetaan label ja samalla sen sisältö
        
            if ( viimeinen_tyhja > -1 && input.value.trim() == "") { // ei kelpuuteta pelkkiä välilyöntejä
                let poistettava = inputit[viimeinen_tyhja].parentNode; // parentNode on label, joka sisältää inputin
                document.forms[0].removeChild( poistettava );
                viimeinen_tyhja = i;
            }
            // ei ole vielä löydetty yhtään tyhjää joten otetaan ensimmäinen tyhjä talteen
            if ( viimeinen_tyhja == -1 && input.value.trim() == "") {
                    viimeinen_tyhja = i;
            }
        }
        // ei ollut tyhjiä kenttiä joten lisätään yksi
        if ( viimeinen_tyhja == -1) {

            let jasenet = document.getElementById("jäsenet");
            
            let label = document.createElement("label");
            for(let i=0; i<inputit.length-7; i++) {
            label.textContent = " Jäsen "+ (i+1+" ");
            label.setAttribute('id', "labelJasen"+(i+1));
                      
            let input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute('id', "inputJasen"+(i+1));
            input.setAttribute('class', "oikea");
            input.addEventListener("input", addNew);
            label.appendChild(input);


            }
   
            jasenet.appendChild(label);
        }
        
    }


});   

var leimaustavat = new Set();


//Lisää joukkueen dataan
function lisaaJoukkue() {

    let lista = document.getElementById("lista");
    
    let nimi = document.getElementById('inputNimi').value;
    let GPS = document.getElementById('inputGPS');
    let NFC = document.getElementById('inputNFC');
    let QR = document.getElementById('inputQR');
    let lomake = document.getElementById('inputLomake');
    let sarja2h = document.getElementById('input2').value;
    let sarja4h = document.getElementById('input4').value;
    let sarja8h = document.getElementById('input8').value;
    let jasen1 = document.getElementById('inputJasen1').value;
    let jasen2 = document.getElementById('inputJasen2').value;
    let id = etsiSuurinId(dataSet.joukkueet) + 1;

     let jasenet = [];
     jasenet.push(jasen1);
     jasenet.push(jasen2);

     let leimausTapa = [];
     if (GPS.checked) {  
         leimausTapa.push(GPS.value);
        }
     if (NFC.checked) { leimausTapa.push(NFC.value);}
     if (QR.checked) { leimausTapa.push(QR.value);}
     if (lomake.checked) { leimausTapa.push(lomake.value);}

     let kaksih = parseInt(sarja2h);
     let neljah = parseInt(sarja4h);
     let kasih = parseInt(sarja8h);

    let tekstiinputit = document.querySelectorAll('input[type="text"]');

        for (let i=3; i < tekstiinputit.length; i++ ) {
            if ( document.getElementById('inputJasen'+i) !== null ){
                      if(typeof document.getElementById('inputJasen'+i).value !== 'undefined') {
                          if ( document.getElementById('inputJasen'+i).value.length !== 0 ){
                         jasenet.push(document.getElementById('inputJasen'+i).value);
                      }
        }
    }
}

 
    
    let uusiJoukkue = {
        'nimi': nimi,
        'leimaustapa': leimausTapa,
        'jasenet': jasenet,
        'sarja': kaksih || neljah || kasih,
        'id': id
    };
    
    dataSet.joukkueet.push(uusiJoukkue);
    jarjestaData(dataSet);
    while( lista.firstChild ){
        lista.removeChild( lista.firstChild );
      }
    lisaaJoukkueetListaan(lista);
    listaaJoukkueet(dataSet.joukkueet, dataSet.leimaustavat);

   if ( document.getElementById('joukkueAlert') === null ){
    lisaaJoukkueIlmoitus(nimi);
} else {
    document.getElementById('joukkueAlert').remove();
    lisaaJoukkueIlmoitus(nimi);
}
    
     let fieldset = document.getElementById('jäsenet');
    
     
     let labels = fieldset.childNodes.length - 7; // Aiemmat labelit, mukaanlukien kaksi ekaa jäsentä
   
    for(let i=0; i<labels; i++) {
        fieldset.removeChild(fieldset.lastChild);
        }
}


//Lisää tiedon joukkueen lisäyksen jälkeen, että tietty joukkue on lisätty 
function lisaaJoukkueIlmoitus(nimi) {



    let joukkueOtsikko = document.querySelector('#joukkueOtsikko');
    let t = document.createElement('p');
    let p = document.createTextNode('Joukkue ' + nimi + ' on lisätty.');
    t.setAttribute("id", "joukkueAlert");
    t.append(p);
   joukkueOtsikko.parentNode.insertBefore(t, joukkueOtsikko.nextSibling);
}


//Etsii suurimman vapaana olevan id:n joukkueelle
function etsiSuurinId(joukkueet) {
    let suurinId = joukkueet[0].id;
    for (let i in joukkueet) {
        if (suurinId < joukkueet[i].id) {
            suurinId = joukkueet[i].id;}
        
    }
    return (suurinId + 1);
} 


//Listaa kaikki joukkueet 
function listaaJoukkueet(joukkueet, leimaustavat) {
    let joukkueetLista = [];
    let joukkue = {};
    let nimi;
    let jasenet;
    let jasen1; let jasen2; let jasen3; let jasen4;
    let leimaustapa;
    let GPS; let NFC; let QR; let lomake;
    let sarja; let sarja2h; let sarja4h; let sarja8h;

    for(let i in joukkueet) {
        for (let j in jasenet) {
            for (let k in leimaustavat) {
        nimi = joukkueet[i][nimi];
        jasen1 = joukkueet[i][jasenet][0];
        jasen2 = joukkueet[i][jasenet][1];
        jasen3 = joukkueet[i][jasenet][2];
        jasen4 = joukkueet[i][jasenet][3];

        GPS = leimaustavat[0];
        NFC = leimaustavat[1];
        QR = leimaustavat[2];
        lomake = leimaustavat[3];

        sarja2h = joukkueet[i].sarja;
        sarja4h = joukkueet[i].sarja;
        sarja8h = joukkueet[i].sarja;
        joukkue = {
            'nimi': nimi,
            'jasenet': [jasen1, jasen2, jasen3, jasen4],
            'leimaustapa': [GPS, NFC, QR, lomake],
            'sarja': sarja2h || sarja4h || sarja8h
        };
        joukkueetLista.push(joukkue);
        }
    }
    }
    console.log(joukkueetLista);
}


//Tarkistaa, että on vähintään yksi leimaustapa valittu
function tarkista_leimaustavat() {
    // haetaan kaikki checkboxit
    let checkboxit = document.querySelectorAll('input[type="checkbox"]');
    // jos leimaustavat-taulukossa on valintoja niin poistetaan virheilmoitukset
    // jos ei ole valintoja niin asetetaan jokaiseen kenttään virheilmoitus
    for (let c of checkboxit) {
        if ( leimaustavat.size > 0 ) {
          c.setCustomValidity("");
          return true;
        } else {
          c.setCustomValidity("Valitse vähintään yksi leimaustapa");
          return false;
        }
    
    }
}

//Tarkistaa, että joukkueella on riittävän pitkä nimi eikä ole sama toisen joukkueen kanssa
function tarkista_joukkueenNimi() {
    let kirjattuNimi = document.getElementById("inputNimi");
    let trimmattuNimi = kirjattuNimi.value.trim();
    kirjattuNimi.setCustomValidity("");
    if (trimmattuNimi === "") {
        kirjattuNimi.setCustomValidity("Nimi ei saa olla tyhjä");
        return false;
    }
    if (trimmattuNimi.length <= 2){
        kirjattuNimi.setCustomValidity("Nimi on liian lyhyt"); 
        return false;
    }

    for (let i in dataSet.joukkueet) {
        if (trimmattuNimi === dataSet.joukkueet[i].nimi.trim()) {
            kirjattuNimi.setCustomValidity("Valitsemasi joukkueen nimi on jo käytössä");
            return false;
        }
    
    }

return true;
}


//Tarkistaa että löytyy leimaustapa
function tarkistaLeimat() {
    leimaustavat = new Set();
    let checkboxit =document.querySelectorAll('input[type="checkbox"]');

    // asetetaan virhetarkistukset jokaiseen checkboxiin
    for (let c of checkboxit) {
        lisaaKuuntelija(c);
    }
}


//Tarkistaa, että joukkueessa on ensimmäinen jäsen
function tarkista_ekanJasenenMaara() {
    let jasenEka = document.getElementById("inputJasen1");
    let trimmattuJasenEka = jasenEka.value.trim();
    jasenEka.setCustomValidity("");
    if (trimmattuJasenEka === "") {
        jasenEka.setCustomValidity("Ensimmäisen jäsenen nimi puuttuu");
        return false;
    }
  
    return true;
}


//Tarkistaa, että joukkueessa on toinen jäsen
function tarkista_tokanJasenenMaara() {
    
    let jasenToka = document.getElementById("inputJasen2");
    let trimmattuJasenToka = jasenToka.value.trim();
    jasenToka.setCustomValidity("");
    if (trimmattuJasenToka === "") {
        jasenToka.setCustomValidity("Toisen jäsenen nimi puuttuu");
        return false;
    }
    return true;
}



//Lisää sivulle listan joukkueiden nimista ja joukkueiden jäsenten nimistä 
function lisaaJoukkueListaan(lista, joukkue) {
    let ul1 = document.getElementById("lista"); 
        
        let li1 = document.createElement("li");
        ul1.appendChild(li1);
        
        li1.appendChild(document.createTextNode(joukkue.nimi));

        let ul2 = document.createElement("ul");

        li1.appendChild(ul2);

         for (let i in joukkue.jasenet) {
         if (joukkue.jasenet[i].length >=1) {
        let li2 = document.createElement("li");
         li2.appendChild(document.createTextNode(joukkue.jasenet[i]));
         ul2.appendChild(li2); 
         }
        }

}

//Lisää kaikki jäsenet listaan omille paikoilleen
function lisaaJoukkueetListaan(lista) {
    
        for (let i in dataSet.joukkueet) {
            
            lisaaJoukkueListaan(lista, dataSet.joukkueet[i]); 
            }     
}


//Järjestää joukkueet ja sen jäsenet etunimen mukaisesti aakkosjärjestykseen
    function jarjestaData(data) {
         data.joukkueet.sort((a,b) => (a.nimi.toLowerCase() > b.nimi.toLowerCase()) ? 1 : ((b.nimi.toLowerCase() > a.nimi.toLowerCase()) ? -1 : 0)); 
          for (let i in data.joukkueet) {
         data.joukkueet[i].jasenet.sort((a,b) => (a.toLowerCase() > b.toLowerCase()) ? 1 : ((b.toLowerCase()> a.toLowerCase()) ? -1 : 0));
        }
    }


    //Jos on leimaustapa palauttaa true
    function tarkistaLeima(checkbox) {
        if (checkbox.checked) {
            return true;
        } else {
            return false;
        }
    }
 

    //Lisää joukkueen listaan, kun painetaan tallenna-nappia
    function submit (event) {
        event.preventDefault();

        let checkboxit = document.querySelectorAll('input[type="checkbox"]');
        var leima = false;
        for (let c of checkboxit) {
            if(tarkistaLeima(c) == true) {
                leima = true;
            }
      }

      if (!leima) { tarkista_leimaustavat();} else {

        lisaaJoukkue();
        document.getElementById("myForm").reset();
        leimaustavat = new Set();
    }
}