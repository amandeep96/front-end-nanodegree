// Goa coordinates
var coordinates = {
    lat: 15.2993,
    lng: 74.1240
};
var map; // for map
var marks = []; // for marks
var win = ''; // for infowindow
//function for dropdown
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};
// open function
function open(title) {
    for (var K in marks) {
        if (marks[K].title == title) {
            //win.mark = marks[i];
            open_info1(marks[K]);
            return;
        }   }
}
// This function is for by default map
function beginMap() {
    appMod.is_error(false);
    win = new google.maps.InfoWindow();
    map = new google.maps.Map(document.getElementById('map'), {
        center: coordinates,
        zoom: 18
    });
    fetch_resorts();
}
//function if map is not working properly.
function mapNotWorking() {
    appMod.is_error(true);
    appMod.error_msg('Map can"t be loaded');
}
//declaring knockout
var appMod = {
    list: ko.observableArray([]), //knockout in list
    searchQuery: ko.observable(), //knockout in search 
    is_error: ko.observable(false), //knockout in errors
    error_msg: ko.observable(''),
    //construct function
    construct: function () {
        for (var i in marks) {
            appMod.list.push(marks[i].title);
        }
    },
// filter function
    filter: function (query) {
        appMod.list.removeAll();
        for (var K in marks) {
            if (marks[K].title.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                appMod.list.push(marks[K].title);
                marks[K].setVisible(true);
            } else {
                marks[K].setVisible(false);
            } // end if else
        } // end for loop
    } // end of filter function
}
//  function used for markers and animation in marker
function curentAnimation(mark) {
    mark.setIcon('http://maps.gstatic.com/mapfiles/ms2/micons/bar.png');
    mark.setAnimation(google.maps.Animation.BOUNCE);
}
//Stop the animation of the marker
function stop_animation(mark) {
    win.mark.setIcon(null);
    win.mark.setAnimation(null);
}
//this function is used for fetching all the nearby resorts of goa.
function fetch_resorts() {
    //using ajax
    $.ajax({
        url: 'https://api.foursquare.com/v2/venues/search?v=20161016&ll=15.2993%2C%2074.1240&query=beach%20resort&limit=10&intent=checkin&client_id=FZADUXJM21GMVSUUYXISW1NJ0GUOTP1XL2SPJSCTT3HJFOND&client_secret=O5HOZ4MQG5Q0XKNLBAKNZDTH0XFR0VAXMWBJ2KBTHBRNXCYH',
        async: true // make it synchronous
    }).done(function (resp) {
        fulldata = resp.response.venues;
        //display of data
        console.log(fulldata);
        //for loop
        for (var i = 0; i < fulldata.length; i++) {
            var mark = new google.maps.Marker({
                title: fulldata[i].name, // take title name
                position: {
                    lat: parseFloat(fulldata[i].location.lat),
                    lng: parseFloat(fulldata[i].location.lng)
                },
                map: map, // storing map into other variable
                animation: google.maps.Animation.DROP, //animation in map
                adres: fulldata[i].location.address // take content of address
            });
            //Adding listner on clicking the mark shows info window
            mark.addListener('click', open_info2);
            marks.push(mark);
        }
        // Limits for the  map
        var bound = new google.maps.LatLngBounds();
        for (var k in marks) {
            bound.extend(marks[k].position);
        }
        map.fitBounds(bound);
        appMod.construct();
    }).fail(function () { // fail function if map will not work
        appMod.is_error(true);
        appMod.error_msg('resorts not displayed');
    });
}
// info window function
function open_info1(mark) {
    if (win.mark !== mark && win.mark !== undefined) {
        stop_animation(win.mark);
    }

    curentAnimation(mark);
    var material = '<h1>' + ' Name - ' + mark.title + '</h1>';
    material += '<h2>' + ' Address - ' + mark.adres + '</h2>';
    win.mark = mark;
    win.setContent(material);
    win.open(map, mark);
    win.addListener('closeclick', stop_animation);
}

function open_info2() {
    open_info1(this);
}
ko.applyBindings(appMod);
appMod.searchQuery.subscribe(appMod.filter);
