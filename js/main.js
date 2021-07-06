function start(){
    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anim1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anim2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='aliado' class='anim3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");

    //Váriaves
    var podeAtirar = true;
    var fimdejogo=false;
    var jogo = {};
    var velocidade = 5;
    var posicaoY = parseInt(Math.random() * 334);
    var tecla = {
        W: 87,
        S: 83,
        D: 68
    };
    var pontos=0;
    var salvos=0;
    var perdidos=0;
    var energiaAtual=3;

    var somDisparo=document.getElementById("somDisparo");
    var somExplosao=document.getElementById("somExplosao");
    var musica=document.getElementById("musica");
    var somGameover=document.getElementById("somGameover");
    var somPerdido=document.getElementById("somPerdido");
    var somResgate=document.getElementById("somResgate");

    //Volume dos sons
    somDisparo.volume= 0.2;
    somExplosao.volume = 0.4;
    somGameover.volume = 0.5;
    somPerdido.volume = 0.5;
    somResgate.volume = 0.0300;

    jogo.pressionou = [];

    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
    });
    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });

    musica.addEventListener("ended", function(){musica.currentTime = 0; musica.play(); },false);
    musica.play();
    ;

    //loop
    jogo.timer = setInterval(loop,30);

    function loop(){
        parallax();
        movejogador();
        moveinimigo1();
        moveinimigo2();
        movealiado();
        colisao();
        placar();
        energia();
    }

    function parallax(){
        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position",esquerda-2);
    }

    function movejogador(){
        if(jogo.pressionou[tecla.W]){
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo-10);
                if(topo<=0){
                    $("#jogador").css("top",topo+10);
                }
            }

        if(jogo.pressionou[tecla.S]){
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo+10);

            if(topo>=434){
                $("#jogador").css("top",topo-10);
                }
            }

        if (jogo.pressionou[tecla.D]) {
            disparo();
            }
        }
    function moveinimigo1(){
        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left",posicaoX-velocidade);
        $("#inimigo1").css("top",posicaoY);

            if(posicaoX<=0){
               posicaoY = parseInt(Math.random()*334);
               $("#inimigo1").css("left",694);
               $("#inimigo1").css("top",posicaoY);
            }
    }
    function moveinimigo2(){
        posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left",posicaoX-3);

            if(posicaoX<=0){
               $("#inimigo2").css("left",775);
            }
    }
    function movealiado(){
        posicaoX = parseInt($("#aliado").css("left"));
        $("#aliado").css("left",posicaoX+1);

            if(posicaoX>906){
               $("#aliado").css("left",0);
            }

    }

    function disparo() {
	
        if (podeAtirar==true) {
            
        podeAtirar=false;

        somDisparo.play();
        
        topo = parseInt($("#jogador").css("top"))
        posicaoX= parseInt($("#jogador").css("left"))
        tiroX = posicaoX + 190;
        topoTiro=topo+37;
        $("#fundoGame").append("<div id='disparo'></div>");
        $("#disparo").css("top",topoTiro);
        $("#disparo").css("left",tiroX);

        var tempoDisparo=window.setInterval(executaDisparo, 20);
	
        } 
            function executaDisparo() {
                posicaoX = parseInt($("#disparo").css("left"));
                $("#disparo").css("left",posicaoX+15); 
        
                        if (posicaoX>900) {
                                
                    window.clearInterval(tempoDisparo);
                    tempoDisparo=null;
                    $("#disparo").remove();
                    podeAtirar=true;
                            
                        }
            } 

    }
    function colisao(){
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#aliado")));
        var colisao6 = ($("#inimigo2").collision($("#aliado")));

        //Colisão inimigo1
            if(colisao1.length>0){

                energiaAtual--;
                inimigo1X = parseInt ($("#inimigo1").css("left"));
                inimigo1Y = parseInt ($("#inimigo1").css("top"));
                explosao1(inimigo1X,inimigo1Y);

                posicaoY = parseInt(Math.random()* 334);
                $("#inimigo1").css("left", 694);
                $("#inimigo1").css("top", posicaoY);
            }
        //Colisão inimigo2
        if(colisao2.length>0){

            energiaAtual--;
            inimigo2X = parseInt ($("#inimigo2").css("left"));
            inimigo2Y = parseInt ($("#inimigo2").css("top"));
            explosao2(inimigo2X,inimigo2Y);

            $("#inimigo2").remove();

            reposicionaInimigo2();
        }
        //Colisao disparo inimigo1
        if(colisao3.length>0){

            velocidade=velocidade+0.3;
            pontos=pontos+100;
            inimigo1X = parseInt ($("#inimigo1").css("left"));
            inimigo1Y = parseInt ($("#inimigo1").css("top"));
            explosao1(inimigo1X,inimigo1Y);
            $("#disparo").css("left",950);

            posicaoY = parseInt(Math.random()* 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }
        //Colisao disparo inimigo2
        if(colisao4.length>0){

            pontos=pontos+50;
            inimigo2X = parseInt ($("#inimigo2").css("left"));
            inimigo2Y = parseInt ($("#inimigo2").css("top"));
            $("#inimigo2").remove();

            explosao2(inimigo2X,inimigo2Y);
            $("#disparo").css("left",950); 
            
            reposicionaInimigo2();
        }
        //Colisao aliado
        if(colisao5.length>0){

            somResgate.play();
            salvos++;
            reposicionaAliado();
            $("#aliado").remove();
        }
        //Colisao aliado inimigo2
        if(colisao6.length){

            perdidos++;
            aliadoX = parseInt($("#aliado").css("left"));
            aliadoY = parseInt($("#aliado").css("top"));
            explosao3(aliadoX, aliadoY);
            $("#aliado").remove();

            reposicionaAliado();
        }
    }

    function explosao1(inimigo1X,inimigo1Y) {

        somExplosao.play();
        $("#fundoGame").append("<div id='explosao1'></div");
        $("#explosao1").css("background-image", "url(img/explosao.png)");
        var div=$("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({width:200, opacity:0}, "slow");
        
        var tempoExplosao=window.setInterval(removeExplosao, 700);
        
            function removeExplosao() {
                
                div.remove();
                window.clearInterval(tempoExplosao);
                tempoExplosao=null;
                
            }
            
    }
    function explosao2(inimigo2X, inimigo2Y){

        somExplosao.play();
        $("#fundoGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(img/explosao.png)");
        var div2=$("#explosao2");
        div2.css("top",inimigo2Y);
        div2.css("left",inimigo2X);
        div2.animate({width:200, opacity:0}, "slow");

        var tempoExplosao2=window.setInterval(removeExplosao2, 700);

            function removeExplosao2(){

                div2.remove();
                window.clearInterval(tempoExplosao2);
                tempoExplosao2=null;
            }
    }
    function explosao3(){
        
        somPerdido.play();
        $("#fundoGame").append("<div id='explosao3' class='anim4'></div>");
        $("#explosao3").css("top", aliadoY);
        $("#explosao3").css("left", aliadoX);

        var tempoExplosao3=window.setInterval(removeExplosao3, 700);

            function removeExplosao3(){
                $("#explosao3").remove();
                window.clearInterval(tempoExplosao3);
                tempoExplosao3=null;
            }
    }

    function reposicionaInimigo2(){
        var tempoColisao4=window.setInterval(reposiciona4, 5000);

            function reposiciona4(){
                window.clearInterval(tempoColisao4);
                tempoColisao4=null;

                    if(fimdejogo==false){
                        $("#fundoGame").append("<div id=inimigo2></div>");
                    }
                }
    }
    function reposicionaAliado(){
        var tempoAliado=window.setInterval(reposiciona6, 6000);

            function reposiciona6(){
            window.clearInterval(tempoAliado);
                tempoAliado=null;

                    if(fimdejogo==false){
                        $("#fundoGame").append("<div id='aliado' class='anim3'></div>");
                    }
                }
    }
    function placar(){
        $("#placar").html("<h2> PONTOS: "+ pontos + " - SALVOS: "+ salvos +" - PERDIDOS: "+ perdidos + "</h2>");
    }

    function energia(){
        if (energiaAtual==3) {
			
			$("#energia").css("background-image", "url(img/energia3.png)");
		}
	
		if (energiaAtual==2) {
			
			$("#energia").css("background-image", "url(img/energia2.png)");
		}
	
		if (energiaAtual==1) {
			
			$("#energia").css("background-image", "url(img/energia1.png)");
		}
	
		if (energiaAtual==0) {
			
			$("#energia").css("background-image", "url(img/energia0.png)");
            //Game Over
            gameover();
		}
    }

    function gameover(){
            fimdejogo = true;
            musica.pause();
            somGameover.play()

            window.clearInterval(jogo.timer);
            jogo.timer=null;

            $("#jogador").remove();
            $("#inimigo1").remove();
            $("#inimigo2").remove();
            $("#aliado").remove();

            $("#fundoGame").append("<div id='fim'></div>");

            $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3> Jogar Novamente </h3></div>");
	} 

}//fim da função start

function reiniciaJogo(){
    somGameover.pause();
    $("#fim").remove();
    start();
}
