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
            $('#openkey').html(code.openkey.join(', '));
            $('#privatekey').html("<p>q=" + code.privatekey.q.join(', ') + "</p>" +
                "<p>r=" + code.privatekey.r.join(', ') + "</p>");
            $('#sendreceive').show();
        }

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
        try {
            for (var i = 0; i < sendstr.length; i++) {
                var binstr=sendstr.charCodeAt(i).toString(2);
                if (code.debug) { code.writedebug("binstr "+binstr); }
                datastr[i] = [];
                var trecstr='';
                for (var j = 0; j < binstr.length; j++) {
                    if (code.debug) { code.writedebug ("<b>next bit: " +binstr[j]+" </b>"); }
                    datastr[i][j]=code.encode(parseInt(binstr[j]));
                    trecstr+=code.decode(datastr[i][j]);
                    maxbitlen=(maxbitlen < datastr[i][j].toString(2).length ?  datastr[i][j].toString(2).length : maxbitlen  );
                }
                htmlstr+="<p>"+datastr[i].join(', ')+"</p>";
                recstr+=String.fromCharCode(parseInt(trecstr,2));
                if (String.fromCharCode(parseInt(trecstr,2)) !== sendstr[i]) {
                    code.writedebug("Send ("+sendstr[i]+") and receive ("+String.fromCharCode(parseInt(trecstr,2))+") symbol  do not match!");
                }
            }
        } catch (err) {
            code.writedebug('error!');
        }


        if (recstr !== sendstr) {
            if (code.debug) { alert ("Send symbol and receive symbol do not match!"); }
         }
        $("#data").html("maxbitlen: "+maxbitlen+htmlstr);
        $("#receive").html('<pre>'+recstr+'</pre>');

    });


});

