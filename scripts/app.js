var myKey = config.token;
// var googleSearch = googleSearch.token;

var model = {
  proPublica1: [],
  proPublica2: [],
  stateRequestArr: [],
  moreInfo: [],
  houseMembers: [],
  googleCivics: []
};

//first call...gets members by zip, pushes into the stateRequest array,
//calls render as the callback function
// function searchMembersByZip(query, callback){

//   $.ajax({
//     type: 'GET',
//     url: 'http://whoismyrepresentative.com/getall_mems.php?zip=' + query + '&output=json',
//     success: function(data){
//       var results = JSON.parse(data);

//       model.stateRequestArr.push(results);

//       callback();
//     }
//   });
// };

function googleCivicsSearch(line1, city, state, zip, callback) {

  var address = line1+city+state+zip;
  $.ajax({
    url: googleSearch.root,
    data: {
      key : googleSearch.token,
      address : address,
      levels : 'country',
      roles : 'legislatorLowerBody'

    },
    success : function(result) {
      console.log(result);
      model.googleCivics = result.officials;
      callback();
    },
    error : function(err) {
      throw err;
    }
  });
};
//once info is gotten from the button click, the data is sent to the proPublica1 array
//the id is then sent to the second propublica call
//this call gets all members by district & state
function proPublicaCallOne(district, state) {

  $.ajax({
    url: config.root +  state + '/' + district + '/current.json',
    type: 'GET',
    data: {
      district: district,
      state: state
    },
    beforeSend: function(xhr) {
      xhr.setRequestHeader("X-API-Key", myKey);
    },
    success: function(data) {
      console.log("WE GOT A RESPONSE!!");
      console.log(data);

      model.proPublica1 = data.results;
      proPublicaCallTwo(model.proPublica1[0].id);

    }
  });

};
//the second call gets the member id, pushes the data into proPublica2, then opens the modal
//this call allows you to pinpoint a specific member by their id that was gotten from the first call
function proPublicaCallTwo(member_id, callback){
  $.ajax({
    url: 'https://api.propublica.org/congress/v1/members/' + member_id + '.json',
    type: 'GET',
    data: {
      member_id: member_id
    },
    beforeSend: function(xhr) {
      xhr.setRequestHeader("X-API-Key", myKey);
    },
    success: function(data) {
      console.log(data);

      model.proPublica2 = data.results;
      openModal();
    }
  });
};

//shows main page listing of members that it gets from the stateRequest array
//pushes all members NOT in the senate (house only) into the house members array
//gives each button a unique id to correspond to the representative in the array
//
// function render(){
//   $("#section-browse-dems ul").empty();

//   var name, party, office, phone, moreInfoBtn, nameList, txt, district, state;


//   for(var i = 0; i < model.stateRequestArr[0].results.length; i++){

//       if(model.stateRequestArr[0].results[i].office.includes("Senate") == false){

//         model.houseMembers.push(model.stateRequestArr[0].results[i]);

//         name = $("<h5></h5>").text(model.stateRequestArr[0].results[i].name);
//         party = $("<p></p>").text(model.stateRequestArr[0].results[i].party);
//         office = $("<p></p>").text(model.stateRequestArr[0].results[i].office);
//         phone = $("<p></p>").text(model.stateRequestArr[0].results[i].phone);
//         moreInfoBtn = $("<button></button>")
//           .text("More Info")
//           .attr('id', i)
//           .attr('class', 'moreInfo')
//         nameList = $("<li></li>")
//           .append(name, party, office, phone, moreInfoBtn,'<hr>');
//         $('#section-browse-dems ul').append(nameList);

//       } else {
//           console.log("senate");
//       }
//     }
//     //once button is clicked, district number, and state are sent to the first propublica api call
//     //more info button
//     $("#section-browse-dems").on('click', '.moreInfo', function(event) {

//       district = this.id;
//       state = this.id;
//       district = model.houseMembers[district].district;
//       state = model.houseMembers[state].state;
//       proPublicaCallOne(district, state);
//       timesCall(name.text());
//       event.preventDefault();
//     });
// };


function render(){

  $("#section-browse-dems ul").empty();

        var name, party, phone, email;

        name = $("<h5></h5>").text(model.googleCivics[0].name);
        party = $("<p></p>").text(model.googleCivics[0].party);
        phone = $("<p></p>").text(model.googleCivics[0].phones[0]);
        // email = $("<p></p>").text(model.googleCivics[0].emails[0]);
        moreInfoBtn = $("<button></button>")
          .text("More Info")
          // .attr('id', i)
          .attr('class', 'moreInfo')
        nameList = $("<li></li>")
          .append(name, party, phone, email, moreInfoBtn, '<hr>');
        $('#section-browse-dems ul').append(nameList);

    // }
    //once button is clicked, district number, and state are sent to the first propublica api call
    //more info button
    $("#section-browse-dems").on('click', '.moreInfo', function(event) {

      // district = this.id;
      // state = this.id;
      // district = model.houseMembers[district].district;
      // state = model.houseMembers[state].state;
      // proPublicaCallOne(district, state);
      // timesCall(name.text());
      openModal();
      event.preventDefault();
    });
};

//the modal is opened, and gets all the needed info from the proPublica2 array
//rendering it on the page.
function openModal(){
  var name, nextElection, party,
      phone, officeAddress, city,
      state, zip, fullAddress, twitter, infoList;

  $("#myModalLabel").empty();
  $("#modalBody ul").empty();

  // name = $("<h3></h3>").text(model.proPublica1[0].name);
  // nextElection = $("<p></p>").text(model.proPublica1[0].next_election);
  name = $("<h3></h3>").text(model.googleCivics[0].name);
  party = $("<p></p>").text(model.googleCivics[0].party);
  phone = $("<p></p>").text(model.googleCivics[0].phones[0]);
  officeAddress = $("<p></p>").text(model.googleCivics[0].address[0].line1);
  city = $("<p></p>").text(model.googleCivics[0].address[0].city);
  state = $("<p></p>").text(model.googleCivics[0].address[0].state);
  zip = $("<p></p>").text(model.googleCivics[0].address[0].zip);
  twitter = $("<p></p>").text(model.googleCivics[0].channels[1].id);

  fullAddress = $("<p></p>").text(officeAddress.text() + '\n ' + city.text() + ' ' + state.text() + '\n' + zip.text());


  // web = $("<p></p>").text(model.proPublica2[0].url);
  // chamber = $("<p></p>").text(model.proPublica2[0].roles[0].chamber);
  // percent = $("<p></p>").text(model.proPublica2[0].roles[0].votes_with_party_pct);
  // party = $("<p></p>").text(model.proPublica2[0].roles[0].party);
  // phone = $("<p></p>").text(model.proPublica2[0].roles[0].phone);

  infoList = $("<li></li>")
    .append(
            "Party: ", party,
            "Phone: ", phone,
            "Twitter: ", twitter,
            "Office Address: ", fullAddress
            );



  $("#myModalLabel").append(name);
  $('#modalBody ul').append(infoList);
  $("#myModal").modal();
};


// COUNTDOWN TIMER

// Set the date we're counting down to
var countDownDate = new Date("Nov 6, 2018 08:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

    // Get todays date and time
    var now = new Date().getTime();

    // Find the distance between now an the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="demo"
    document.getElementById("clock").innerHTML = days + "<span class='cdText'>days</span> " + hours + "<span class='cdText'>hours</span> "
    + minutes + "<span class='cdText'>minutes</span> " + seconds + "<span class='cdText'>seconds</span> ";

    // If the count down is over, write some text
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("clock").innerHTML = "HOPE YOU VOTED!";
    }
}, 1000);




