$(document).ready(function() {

    var gridbase = $(".col_grid");

    for(let i = 0; i < 100; i++)
    {
        var gridCol = gridbase.prepend('<div class="pixel"></div>');
    }

    GetGrid();

    setInterval(function() {
       GetGrid();
    }, 10000); // 10secs
});

function GetGrid() {
    $.get("./data", function( data ) {
        console.log(data);
        SetGrid(data);
    });
}

function SetGrid(_grid) {
    $(".pixel").each(function(index) {
        console.log( _grid[index]);
        $( this ).css("background", _grid[index]);
    });
}