$(() => {

    function taskHtml(task) {
            // The taskHtml method takes in a JavaScript representation
            // of the task and produces an HTML representation using
            // <li> tags
        var checkedStatus = task.done ? "checked" : "";
        var liClass = task.done ? "completed" : "";
        var liElement = '<li id="listItem-' + task.id + '" class="' + liClass + '">' + 
            '<div class="view"><input class="toggle" type="checkbox"' +
            " data-id='" + task.id + "'" + 
            checkedStatus +
            '><label>' +
            task.title +
            '</label></div></li>';

        return liElement;
    };

    function toggleTask(e) {
            // toggleTask takes in an HTML representation of
            // an event that fires from an HTML representation of
            // the toggle checkbox and  performs an API request to toggle
            // the value of the `done` field
        var itemId = $(e.target).data("id");
        var doneValue = Boolean($(e.target).is(':checked'));
        $.post("/tasks/" + itemId, {
            _method: "PUT",
            task: {
                done: doneValue
            }
        }).success((data) => {
            var liHtml = taskHtml(data);
            var $li = $("#listItem-" + data.id);
            $li.replaceWith(liHtml);
            $('.toggle').change(toggleTask);
        });
    };

    $.get("/tasks").success(( data ) => {
        var htmlString = "";
        $.each(data, (index, task) => {
            htmlString += taskHtml(task);
        });
        $('.todo-list').html(htmlString);
        $('.toggle').change(toggleTask);
    });

    $('#new-form').submit((event) => {
        event.preventDefault();
        var newtask = $('.new-todo').val();
        var addtask = newtask.charAt(0).toUpperCase() + newtask.slice(1)
        var payload = {task: {title: addtask, done: false}};      
        $.post("/tasks", payload).success((data) => {
            var htmlString = taskHtml(data);
            $('.todo-list').append(htmlString);
            $('.toggle').change(toggleTask);
        });
        $('.new-todo').val('')
    });
});