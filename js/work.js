/**
 * Created by russkiy on 08.05.15.
 */
var code;


$(document).ready(function () {
    code = new Codered();
    code.createKey();
    console.log(code);

    var str='';
    for (var i = 0; i < code.keyLen; i++) {
        str+=code.getRandomInt(0, 1);
    }
    console.log("start="+str)
    console.log("10start="+parseInt(str,2))
    console.log(code.encode(str));

});

/*
$(document).ready(function () {
     code = new Codered();

    $('#keyLen').val(code.keyLen);
    $('#circles').val(code.circles);
    $('#maxq').val(code.maxq);
    $('#qfrommax').val(code.qfrommax);
    $('#minr').val(code.minr);
    $('#maxplus').val(code.maxplus);
    $('#minplus').val(code.minplus);
    $('#decodeplus').val(code.decodeplus);
    $('#maxbitlen').val(code.maxbitlen);
    $('#maxbittrys').val(code.maxbittrys);


    $('#keyLen').on("change",function () {
         if (!isNaN(parseInt($(this).val()))  && parseInt($(this).val())>0) {
             code.keyLen=parseInt($(this).val());
         }
    });
    $('#circles').on("change",function () {
        if (!isNaN(parseInt($(this).val()))  && parseInt($(this).val())>0) {
            code.circles=parseInt($(this).val());
        }
    });
    $('#maxq').on("change",function () {
        if (!isNaN(parseInt($(this).val()))  && parseInt($(this).val())>0) {
            code.maxq=parseInt($(this).val());
        }
    });
    $('#qfrommax').on("change",function () {
        if (!isNaN(parseInt($(this).val()))  && parseInt($(this).val())>0) {
            code.qfrommax=parseInt($(this).val());
        }
    });

    $('#minr').on("change",function () {
        if (!isNaN(parseInt($(this).val()))  && parseInt($(this).val())>0) {
            code.minr=parseInt($(this).val());
        }
    });
    $('#maxplus').on("change",function () {
        if (!isNaN(parseInt($(this).val()))  && parseInt($(this).val())>0) {
            code.maxplus=parseInt($(this).val());
        }
    });
    $('#minplus').on("change",function () {
        if (!isNaN(parseInt($(this).val()))  && parseInt($(this).val())>0) {
            code.minplus=parseInt($(this).val());
        }
    });
    $('#decodeplus').on("change",function () {
        if (!isNaN(parseInt($(this).val()))  && parseInt($(this).val())>0) {
            code.decodeplus=parseInt($(this).val());
        }
    });
    $('#maxbitlen').on("change",function () {
        if (!isNaN(parseInt($(this).val()))  && parseInt($(this).val())>0) {
            code.maxbitlen=parseInt($(this).val());
        }
    });
    $('#maxbittrys').on("change",function () {
        if (!isNaN(parseInt($(this).val()))  && parseInt($(this).val())>0) {
            code.maxbittrys=parseInt($(this).val());
        }
    });




    $('#minimize').on("change",function () {
        if ($('#minimize') .prop('checked')){
            code.minimize=true;
        } else {
            code.minimize=false;
        }

    });




    if (code.minimize) { $('#minimize') .prop('checked', true); }
    else { $('#minimize') .prop('checked', false);  }


    if (code.debug) { $('#debug') .prop('checked', true); }
    else { $('#debug') .prop('checked', false);  }

    $('#sendreceive').hide();

  code.writedebug = function (text) {
      if (this.debug) {
          var time = new Date();

          if (typeof text === 'object' || typeof text === 'array') {
              var output = '';
              for (var property in text) {
                  if (typeof text[property] !== 'function' ) {
                      output += '<strong>'+property + '</strong>: ' + text[property]+';<br>';
                  }

              }
              $("#debugrow").prepend("<p>"+time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()+" : "+output+"</p>");
          } else {
              $("#debugrow").prepend("<p>"+time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()+" : "+text+"</p>");
          }

      }
  };

    function creanekey() {


        var res = code.createKey();
        $('#genkey').toggleClass('active');
        $('#genkey').prop('gen', 0);
        if (code.debug) { code.writedebug(code); }
        if (res) {
            $('#openkey').val(code.openkey.join(', '));
            $('#privatekey').html("<p>q=" + code.privatekey.q.join(', ') + "</p>" +
                "<p>r=" + code.privatekey.r.join(', ') + "</p>"+
                "<p>invert=" + code.privatekey.invert.join(', ') + "</p>");
            $('#sendreceive').show();
        }

        $('#keyLen').val(code.keyLen);
        $('#circles').val(code.circles);
        $('#maxq').val(code.maxq);
        $('#minr').val(code.minr);
        $('#maxplus').val(code.maxplus);
        $('#minplus').val(code.minplus);
        $('#decodeplus').val(code.decodeplus);

    }

    $('#debug').on("change",function () {
        if ($('#debug') .prop('checked')){
            code.debug=true;
        } else {
            code.debug=false;
        }

    });

    $('#cleardebug').on("click",function () {
        $('#debugrow').html('');
    });


    $('#genkey').on("click",function () {
        if (!$(this).prop('gen')) {
            $('#sendreceive').hide();
            $(this).toggleClass('active');
            $(this).prop('gen', 1);
            $('#openkey').val('');
            $('#privatekey').html('');
            setTimeout(creanekey, 1000)
        }

    });

    $("#sendbut").on("click",function () {
        var datastr= [];
        var sendstr=$('#send').val();
        var htmlstr='';
        var recstr ='';
        var maxbitlen=0

        if (code.debug) { code.writedebug ("<b>Start!</b>"); }

        $('#indig').html('');
            for (var i = 0; i < sendstr.length; i++) {

                var binstr=sendstr.charCodeAt(i).toString(2);
                $('#indig').append(binstr+' ');
                if (code.debug) { code.writedebug("binstr "+binstr); }
                datastr[i] = [];
                var trecstr='';
                for (var j = 0; j < binstr.length; j++) {
                    if (code.debug)  code.writedebug ("<b>next bit: " +binstr[j]+" </b>");
                    datastr[i][j]=code.encode(parseInt(binstr[j]));

                    //decode
                    var decoded=code.decode(datastr[i][j]);
                    if (code.debug) code.writedebug("<b>decode bit</b> "+decoded);
                    trecstr+=decoded;
                    maxbitlen=(maxbitlen < datastr[i][j].toString(2).length ?  datastr[i][j].toString(2).length : maxbitlen  );
                }
                htmlstr+= datastr[i].join(', ')+"\n";
                recstr+=String.fromCharCode(parseInt(trecstr,2));
                if (String.fromCharCode(parseInt(trecstr,2)) !== sendstr[i]) {
                    code.writedebug("Send ("+sendstr[i]+") and receive ("+String.fromCharCode(parseInt(trecstr,2))+") symbol  do not match!");
                }
            }



        if (recstr !== sendstr) {
            if (code.debug) { alert ("Send symbol and receive symbol do not match!"); }
         }
        $("#datamax").html("maxbitlen: "+maxbitlen);
        $("#data").val( htmlstr);
        $("#receive").html('<pre>'+recstr+'</pre>');

    });


});

*/