
var data = {
  labels: [1998, 2000, 2002, 2004, 2006, 2008, 2010, 2012, 2014, 2016],
    series: [
    [98, 98, 96, 98, 94, 94, 85, 90, 95, 97],
    [42, 56, 50, 41, 21, 20, 19, 21, 19, 18]
  ],
};




var options = {
  seriesBarDistance: 25,
  axisY: {
    showGrid: false,
    showLabel: false,
    labelInterpolationFnc: function (value) {
        if(value == 0) {
          return value + '%';
        } else {
          return (value /10) +  '0%';
        }
    },
  },
  axisX: {
    showGrid: false,
  },
  width: 1360,
  height: 290,

};

var responsiveOptions = [
  ['screen and (min-width: 641px) and (max-width: 1024px)', {
    seriesBarDistance: 5,
    axisX: {
      labelInterpolationFnc: function (value) {
        return value;
      }
    }
  }],
  ['screen and (max-width: 640px)', {
    seriesBarDistance: 5,
    axisX: {
      labelInterpolationFnc: function (value) {
        return value[0];
      }
    }
  }]
];

new Chartist.Bar('.ct-chart', data, options, responsiveOptions);



var $tooltip = $('<div class="tooltip tooltip-hidden"></div>').appendTo($('.ct-chart'));

$(document).on('mouseenter', '.ct-bar', function() {
  var seriesName = $(this).closest('.ct-series').attr('ct:series-name'),
      value = $(this).attr('ct:value');

  $tooltip.text(value + '%');
  $tooltip.removeClass('tooltip-hidden');
});

$(document).on('mouseleave', '.ct-bar', function() {
  $tooltip.addClass('tooltip-hidden');
});

$(document).on('mousemove', '.ct-bar', function(event) {
  console.log(event);
  $tooltip.css({
    left: (event.offsetX || event.originalEvent.layerX) - $tooltip.width() / 2,
    top: (event.offsetY || event.originalEvent.layerY) - $tooltip.height() - 20
  });
});
