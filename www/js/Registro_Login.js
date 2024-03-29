//Para coger registro datos

function registro_artista(){

  let nombre_artista=document.getElementById("name").value;
  let select_gender=document.getElementById("gender");
  let gender_artista=select_gender.options[select_gender.selectedIndex].value;
  let email_artista=document.getElementById("email").value;
  let password_artista=document.getElementById("password").value;
  let descripcion_artista=document.getElementById("description").value;
  let twitter_artista=document.getElementById("twitter").value;
  let youtube_artista=document.getElementById("youtube").value;
  let facebook_artista=document.getElementById("facebook").value;
  let instagram_artista=document.getElementById("instagram").value;
  let webpage_artista=document.getElementById("webpage").value;
  let imagen_artista=false;
  //let imagen_artista=document.getElementById("imagen").files[0];

  if(!emailIsValid(email_artista)){

    alert("Introduzca un email válido.");

  }else if(password_artista.length<8){
    alert("Introduzca una contraseña de 8 caracteres al menos.")
  }


  else if(nombre_artista=="" || gender_artista=="" || email_artista=="" || password_artista==""){
    try{
    window.plugins.toast.showShortCenter('Introduzca todos los campos obligatorios.', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
    }catch(e){
      alert("Introduzca todos los campos obligatorios.");
    }
  }else if(nombre_artista.length>49 || email_artista.length>49){
    try{
    window.plugins.toast.showShortCenter('El email y el nombre no pueden tener más de 50 caracteres.', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
    }catch(e){
      alert('El email y el nombre no pueden tener más de 50 caracteres.');
    }
  }else{
    let datos_post=new FormData();
    datos_post.append("email",email_artista);
    datos_post.append("password",password_artista);
    datos_post.append("name",nombre_artista);
    datos_post.append("gender",gender_artista);

    if(descripcion_artista!=""){
        datos_post.append("description",descripcion_artista);
    }
    if(twitter_artista!=""){
      datos_post.append("twitter",twitter_artista);
    }
    if(youtube_artista!=""){
      datos_post.append("youtube",youtube_artista);
    }
    if(facebook_artista!=""){
      datos_post.append("facebook",facebook_artista);
    }
    if(instagram_artista!=""){
      datos_post.append("instagram",instagram_artista);
    }
    if(webpage_artista!=""){
      datos_post.append("webpage",webpage_artista);
    }
    if(imagen_artista){
      let reader= new FileReader();
      reader.readAsDataURL(imagen_artista);
      let img= new Image();
      reader.onloadend = function() {

            datos_post.append("image",imagen_artista);
            console.log(datos_post);
      }
    }
    enviar_datos(datos_post);
  }
}
//Funcion para coger datos de login
function login_artista(){

  let email_artista=document.getElementById("email").value;
  let password_artista=document.getElementById("password").value;

  if(email_artista=="" || password_artista==""){
    try{
    window.plugins.toast.showShortCenter('Introduzca todos los campos obligatorios.', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
    }catch(e){
      alert("Introduzca todos los campos obligatorios.");
    }
  }else if(email_artista.length>49){
    try{
    window.plugins.toast.showShortCenter('El email no pueden tener más de 50 caracteres.', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
    }catch(e){
      alert('El email no pueden tener más de 50 caracteres.');
    }
  }else{
      let datos_post=new FormData();
      datos_post.append("email",email_artista);
      datos_post.append("password",password_artista);
      enviar_datos_login(datos_post);
  }

}

//Funcion para enviar los datos del formulario

function enviar_datos(datos_post){
  $.ajax({
  url: "https://livevent.es/api/v1/artist_create.php",
  type: "POST",
  data :datos_post,
  processData: false,
  contentType: false,
  success:  function(result,status){
      if(status==="success"){
        let datos=JSON.parse(JSON.stringify(result));
        if(datos['msg']=="Artista creado correctamente"){
          try{
          window.plugins.toast.showShortCenter('Usuario creado correctamente.', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
          window.open("LoginArtista.html","_self");
          }catch(e){
            alert('Usuario creado correctamente.');
            window.open("LoginArtista.html","_self");
          }
        }else{
          try{
          window.plugins.toast.showShortCenter('Email/Nombre ya en uso', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
          }catch(e){
            alert('Email/Nombre ya en uso');

          }
        }

        }
      }
    }

  );
}

//Funcion para enviar los datos del formulario

function enviar_datos_login(datos_post){



  $.ajax({
  url: "https://livevent.es/api/v1/artist_login.php",
  type: "POST",
  data :datos_post,
  processData: false,
  contentType: false,
  success:  function(result,status){
      if(status==="success"){
        let datos=JSON.parse(JSON.stringify(result));
        console.log(datos);
        if(datos['msg']=="Email o contraseña incorrectas"){
          try{
          window.plugins.toast.showShortCenter('Email o contraseña incorrectas.', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
          }catch(e){
            alert('Email o contraseña incorrectas.');
          }

        }else{
          window.open("PerfilArtistaLogin.html?id="+datos['artistID'],"_top");
        }
        /*
        if(datos['msg']=="Artista creado correctamente"){
          try{
          window.plugins.toast.showShortCenter('Usuario creado correctamente.', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
          window.open("LoginArtista.html","_self");
          }catch(e){
            alert('Usuario creado correctamente.');
            window.open("LoginArtista.html","_self");
          }
          */
        }else{
          try{
          window.plugins.toast.showShortCenter('Error al conectarse', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
          }catch(e){
            alert('Error al conectarse');
        }
        }
      }
    }
  );
}

//Comprobar si un email es de verdad un email

function emailIsValid (email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
