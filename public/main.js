$('.del').click(function (e) {
  const id = e.target.dataset.id
  $.ajax({
    method: 'DELETE', 
    url: '/delete',
    data: { _id: id }
  }).done(function (result) {
  }).fail(function(){})
})

const serachEl = document.querySelector('#search')
serachEl.addEventListener('click',() => {
  const val = document.querySelector('#search-input').value
  window.location.replace('/search?value=' + val)
})

