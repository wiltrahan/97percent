var myKey = config.token;

var model = {
  proPublica1: [],
  proPublica2: [],
  stateRequestArr: [],
  moreInfo: [],
  houseMembers: []
};


function searchMembersByZip(query, callback){

  $.ajax({
    type: 'GET',
    url: 'http://whoismyrepresentative.com/getall_mems.php?zip=' + query + '&output=json',
    success: function(data){
      var results = JSON.parse(data);

      model.stateRequestArr.push(results);

      callback();
    }
  });
};



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
      console.log("WE GOT A SECOND RESPONSE!!");
      console.log(data);

      model.proPublica2 = data.results;
      openModal();
    }
  });

};



function render(){

  $("#section-browse-dems ul").empty();

  var name, party, office, phone, moreInfoBtn, nameList, txt, district, state;


  for(var i = 0; i < model.stateRequestArr[0].results.length; i++){

      if(model.stateRequestArr[0].results[i].office.includes("Senate") == false){

        model.houseMembers.push(model.stateRequestArr[0].results[i]);

        name = $("<h5></h5>").text(model.stateRequestArr[0].results[i].name);
        party = $("<p></p>").text(model.stateRequestArr[0].results[i].party);
        office = $("<p></p>").text(model.stateRequestArr[0].results[i].office);
        phone = $("<p></p>").text(model.stateRequestArr[0].results[i].phone);
        moreInfoBtn = $("<button></button>")
          .text("More Info")
          .attr('id', i)
          .attr('class', 'moreInfo');
        nameList = $("<li></li>")
          .append(name, party, office, phone, moreInfoBtn, '<hr>');
        $('#section-browse-dems ul').append(nameList);

      } else {
          console.log("other");
      }
    }

    $("#section-browse-dems").on('click', '.moreInfo', function(event) {

      district = this.id;
      state = this.id;
      district = model.houseMembers[district].district;
      state = model.houseMembers[state].state;
      proPublicaCallOne(district, state);
      event.preventDefault();
    });
};


function openModal(){
  var name, nextElection, web, chamber, percent, party, phone, infoList;

  $("#myModalLabel").empty();
  $("#modalBody ul").empty();

  name = model.proPublica1[0].name;
  nextElection = $("<p></p>").text(model.proPublica1[0].next_election);

  web = $("<p></p>").text(model.proPublica2[0].url);
  chamber = $("<p></p>").text(model.proPublica2[0].roles[0].chamber);
  percent = $("<p></p>").text(model.proPublica2[0].roles[0].votes_with_party_pct);
  party = $("<p></p>").text(model.proPublica2[0].roles[0].party);
  phone = $("<p></p>").text(model.proPublica2[0].roles[0].phone);

  infoList = $("<li></li>")
    .append("Next Election: ", nextElection,
            "Website: ", web,
            "Chamber: ", chamber,
            "Votes With Party: ", percent,
            "Party: ", party,
            "Phone: ", phone);



  $("#myModalLabel").append(name);
  $('#modalBody ul').append(infoList);
  $("#myModal").modal();
}




