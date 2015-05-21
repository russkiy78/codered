/**
 * Created by russkiy on 08.05.15.
 */

$(document).ready(function () {
    var code = new Codered();


    //
    $("#keyparam").html(" <p>keyLen=" + code.keyLen + "<br>" +
        " circles=" + code.circles + "<br>" +
        " maxq=" + code.maxq + "<br>" +
        " minr=" + code.minr + "<br>" +
        " maxplus=" + code.maxplus + "<br>" +
        " minplus=" + code.minplus + "<br>" +
        " maxminus=" + code.maxminus + "<br>" +
        " minminus=" + code.minminus + "</p>");
    $('#sendreceive').hide();


    function creanekey() {
        code.createKey();
        $('#genkey').toggleClass('active');
        $('#genkey').prop('gen', 0);
       // console.log(code);
        $('#openkey').html(code.openkey.join(', '));
        $('#privatekey').html("<p>q=" + code.privatekey.q.join(', ') + "</p>" +
            "<p>r=" + code.privatekey.r.join(', ') + "</p>");
        $('#sendreceive').show();
    }


    $('#genkey').on("click",function () {
    //    console.log($(this).prop('gen'));
        if (!$(this).prop('gen')) {
            $('#sendreceive').hide();
            $(this).toggleClass('active');
            $(this).prop('gen', 1);
            setTimeout(creanekey, 1000)
        }

    });

    $("#sendbut").on("click",function () {
        var datastr= [];
        var sendstr=$('#send').val();
        var htmlstr='';
        var recstr ='';
        var maxbitlen=0

        for (var i = 0; i < sendstr.length; i++) {
            var binstr=sendstr.charCodeAt(i).toString(2);
            datastr[i] = [];
            var trecstr='';
            for (var j = 0; j < binstr.length; j++) {
                datastr[i][j]=code.encode(parseInt(binstr[j]));
                 trecstr+=code.decode(datastr[i][j]);
                maxbitlen=(maxbitlen < datastr[i][j].toString(2).length ?  datastr[i][j].toString(2).length : maxbitlen  );
              //  console.log(datastr[i][j].toString(2).length);
            }
            htmlstr+="<p>"+datastr[i].join(', ')+"</p>";

            recstr+=String.fromCharCode(parseInt(trecstr,2));

        }
        if (recstr !== sendstr) {
            alert ("error!");
        }
        $("#data").html("maxbitlen: "+maxbitlen+htmlstr);
        $("#receive").html(recstr);

    });


});

