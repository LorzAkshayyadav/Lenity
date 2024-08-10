$(document).ready(function(){

  $('#f1').on('click', function(){
      $.ajax({
        success: function(response){
          if(response)
          window.location.href = "/home/food"
        }
      });
      return false;
  });

  $('#f2').on('click', function(){
    $.ajax({
      success: function(response){
        if(response)
        window.location.href = "/item"
      }
    });
    return false;
});

$('#form1').on('submit', function(){
  var name = $('#name');
  var quantity =$('#quantity');
  var location = $('#location');
  var newdata = {name: name.val(), quantity: quantity.val(), location: location.val()};

  $.ajax({
    type: 'POST',
    url: '/home/food',
    data: newdata,
    success: function(data){
      //do something with the data via front-end framework
      window.location.href = "/home/food-donate/" + name.val();
    }
  });

  return false;

});

//---------------------------------------

$('#form2').on('submit', function(){
  var name = $('#name');
  var category =$('#category');
  var location = $('#location');
  var description = $('#description');
  var quantity =$('#quantity');
  var age =$('#age');
  var delivery_location = $('#delivery_location');
  var newdata = {name: name.val(), category: category.val(), quantity: quantity.val(), location: location.val(), description: description.val(), age: age.val(), delivery_location: delivery_location.val()};

  $.ajax({
    type: 'POST',
    url: '/item',
    data: newdata,
    success: function(data){
      //do something with the data via front-end framework
      window.location.href = "/item/item-donate/" + name.val();
    }
  });

  return false;

});

//---
$('.exe-confirm').on('click', function(){
  // var id = $('#id');
  var id = $(this).val()
  console.log('Printing Id')
  console.log(id)
  $.ajax({
    type: 'POST',
    url: '/executive/dashboard',
    data: {id:id, 'type':'food'},
    success: function(data){
      //do something with the data via front-end framework
      location.reload();
    }
  });

  return false;

});

$('.exe-confirm2').on('click', function(){
  // var id = $('#id');
  var id = $(this).val()
  console.log('Printing Id')
  console.log(id)
  $.ajax({
    type: 'POST',
    url: '/executive/dashboard',
    data: {id:id,'type':'item'},
    success: function(data){
      //do something with the data via front-end framework
      location.reload();
    }
  });

  return false;

});

});
