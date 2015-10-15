module.exports = {
    calculateExpiry : calculateExpiry,
    pagination : pagination,
    str_random : str_random
};

function calculateExpiry(time,format){
    if (typeof time != 'string'){
        return time;
    }

    var hour = 3600000,//ms
        day = hour * 24,
        month = day * 30,
        year = day * 365;

    var char = time.match(/[a-zA-Z]/g);
    var num = time.match(/\d+/g);
    var expires;
    char[0] = char[0].toUpperCase();
    switch (char[0]) {
        case 'D' : expires = num * day;
            break;
        case 'M' : expires = num * month;
            break;
        case 'Y' : expires = num * year;
            break;
        case  'H' : expires = num * hour;
            break;
        default : expires = hour;
            break;
    }
    switch (format){
        case 'S' : expires = expires/1000;
            break;
    }

    return expires;
}

function pagination(count,results_per_page,page) {
    var regFinal = results_per_page * page;
    var regInicial = regFinal - results_per_page;
    var tmp = {};
    tmp.page = page;
    tmp.total = Math.ceil(count/results_per_page);
    tmp.next = parseInt(page) + 1;
    tmp.prev = parseInt(page) - 1;
    if (regInicial == 0){
        regInicial++;
    }
    if (page == tmp.total){
        regFinal = count;
    }
    if (page > 1){
        regInicial++;
    }
    tmp.from = regInicial;
    tmp.to = regFinal;

    var totalRecordsControl = count;
    if ((totalRecordsControl%results_per_page!=0)){
        while(totalRecordsControl%results_per_page!=0){
            totalRecordsControl++;
        }
    }

    var ultimo = String(page).substr(-1),begin=0,end=0,pageInicial=0;
    tmp.pages = [];
    if (ultimo == 0){
        begin = (page-9);
        pageInicial = (page - ultimo);
        end = page;
    }
    else{
        pageInicial = (page - ultimo);
        begin = (page-ultimo)+1;
        end = pageInicial+10;
    }
    var num = tmp.total;
    if (end>num){
        end = num;
    }
    for (var a = begin; a <= end ; a++){
        tmp.pages.push(a);
    }
    return tmp;
}

function str_random(length){
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = length || 8;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
}
