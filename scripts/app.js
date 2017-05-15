var myKey = config.token;
// var googleSearch = googleSearch.token;

var model = {
  proPublica1: [],
  proPublica2: [],
  googleCivics: []
};


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
      alert("Address not found, please try again!");
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

;

//the modal is opened, and gets all the needed info from the googleCivics array
//rendering it on the page.
function openModal(){
  var name, party, phone,
      officeAddress, city, state,
      zip, fullAddress, twitter, infoList;

  $("#myModalLabel").empty();
  $("#modalBody ul").empty();

  name = $("<h3></h3>").text(model.googleCivics[0].name);
  party = $("<p></p>").text(model.googleCivics[0].party);
  phone = $("<p></p>").text(model.googleCivics[0].phones[0]);
  officeAddress = $("<p></p>").text(model.googleCivics[0].address[0].line1);
  city = $("<p></p>").text(model.googleCivics[0].address[0].city);
  state = $("<p></p>").text(model.googleCivics[0].address[0].state);
  zip = $("<p></p>").text(model.googleCivics[0].address[0].zip);
  twitter = $("<p></p>").text(model.googleCivics[0].channels[1].id);

  fullAddress = $("<p></p>").text(officeAddress.text() + '\n ' + city.text() + ' ' + state.text() + '\n' + zip.text());
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




