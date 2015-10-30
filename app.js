var itemTemplate = $('#templates .item')
var list = $('#list')

var addItemToPage = function(itemData) {
    var item = itemTemplate.clone()
    item.attr('data-id', itemData.id)
    item.find('.description').text(itemData.description)

    if (itemData.completed) {
        item.addClass('completed')
    }
    list.append(item)
}

var loadRequest = $.ajax({
    type: 'GET',
    url: 'https://listalous.herokuapp.com/lists/Listo'
})

loadRequest.done(function(data) {
    var itemsData = data.items

    itemsData.forEach(function(itemData) {
        addItemToPage(itemData)
    })

    $('.description').on('blur', function(event) {
        var item = $(event.target).parent()
        var isItemCompleted = item.hasClass('completed')
        var itemId = item.attr('data-id')
        var description = item.find('.description').text()

        var editRequest = $.ajax({
            type: 'PUT',
            url: 'http://listalous.herokuapp.com/lists/Listo/items/' + itemId,
            data: { description: description, completed: isItemCompleted }
        })
    })
})

$('#add-form').submit(function(event) {
    event.preventDefault()
    var itemDescription = event.target.itemDescription.value
    var creationRequest = $.ajax({
        type: 'POST',
        url: "http://listalous.herokuapp.com/lists/Listo/items/",
        data: { description: itemDescription, completed: false }
    })

    creationRequest.done(function(itemDataFromServer) {
        addItemToPage(itemDataFromServer)
    })
})

$('#list').on('click', '.complete-button', function(event) {
    var item = $(event.target).parent()
    var isItemCompleted = item.hasClass('completed')
    var itemId = item.attr('data-id')

    var updateRequest = $.ajax({
        type: 'PUT',
        url: 'https://listalous.herokuapp.com/lists/Listo/items/' + itemId,
        data: { completed: !isItemCompleted },
    })

    updateRequest.done(function(itemData) {
        if (itemData.completed) {
            item.addClass('completed')
        } else {
            item.removeClass('completed')
        }
    })
})

$('#list').on('click', '.delete-button', function(event) {
    var item = $(event.target).parent()
    var itemId = item.attr('data-id')

    var deleteRequest = $.ajax({
        type: 'DELETE',
        url: 'https://listalous.herokuapp.com/lists/Listo/items/' + itemId,
    })

    deleteRequest.done(function(itemData) {
        item.remove()
    })
})