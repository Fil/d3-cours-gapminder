d3.select('body')
.append('header')
.html('<h1>Cours de D3.js</h1>');


var page = window.location.href.match(/page(\d+)\.html/), pages = '';

if (page) {
    page = parseInt(page[1]);

    if (page > 1)
        pages += '<a href=page'+(page-1)+'.html>&lt;</a> | ';
    else
        pages += '  | ';

    if (page < 19)
       pages += '<a href=page'+(page+1)+'.html>&gt;</a>';

}

d3.select('body')
.append('footer')
.html(pages);