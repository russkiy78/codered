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


    var prevdata='';
    $('#send').on("change",function () {
        var sendstr=$('#send').val();
        console.log(sendstr);
    });


    $("#sendbut").on("click",function () {
        var datastr= [];
        var sendstr=$('#send').val();

        var htmlstr='';
        var recstr ='';

        for (var i = 0; i < sendstr.length; i++) {
            var binstr=sendstr.charCodeAt(i).toString(2);
            datastr[i] = [];
            var trecstr='';
            for (var j = 0; j < binstr.length; j++) {
                datastr[i][j]=code.encode(parseInt(binstr[j]));
             //  console.log("from "+binstr[j]+" to"+code.decode(datastr[i][j]));
                trecstr+=code.decode(datastr[i][j]);
            }
            htmlstr+="<p>"+datastr[i].join(', ')+"</p>";

            recstr+=String.fromCharCode(parseInt(trecstr,2));

        }
        if (recstr !== sendstr) {
            alert ("error!");
        }
        $("#data").html(htmlstr);
        $("#receive").html(recstr);

    });


});

