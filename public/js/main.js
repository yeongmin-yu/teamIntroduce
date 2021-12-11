// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB5IMF1swlixzZPB3hBsTTABIT5KBHmms4",
    authDomain: "teamintroduce-bd4ca.firebaseapp.com",
    projectId: "teamintroduce-bd4ca",
    storageBucket: "teamintroduce-bd4ca.appspot.com",
    messagingSenderId: "4746707129",
    appId: "1:4746707129:web:e25daa30af733905171b68"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function validateInput(name, parent){
    if(!!parent == false){
        parent = document;
    }
    let x = $(parent).find('[name='+name+']').val();   
    let text;
    if (x.trim() == "") {
        let p = document.createElement("p");
        p.className  = "validlabel";
        p.innerHTML = "This field is required";
        $(parent).find('[name='+name+']').after(p);
    } else {
      text = "";
    }
    
 
    if(text == "") return true;
    else return false;
}

if(document.location.href.indexOf("index.html")>=0){

    $( document ).ready( function() {
            
       
        $(window).scroll( function(){
            
            $('.ani').each( function(i){
    
                var bottom_of_element = $(this).offset().top + $(this).outerHeight();
                var bottom_of_window = $(window).scrollTop() + $(window).height();
    
                if( bottom_of_window-bottom_of_window*-0.15 > bottom_of_element ){
                    $(this).animate({'opacity':'1','margin-top':'0'},150);
                }
    
            });
        });
    } );
}
else if(document.location.href.indexOf("team_add.html")>=0){
    const db = firebase.firestore();
    const storage= firebase.storage();

    
    $('[name=profile]').change(function(){
        ext = $(this).val().split('.').pop().toLowerCase(); //확장자
        //배열에 추출한 확장자가 존재하는지 체크
        if($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
            resetFormElement($(this)); //폼 초기화
            window.alert('이미지 파일이 아닙니다! (gif, png, jpg, jpeg 만 업로드 가능)');
        } else {
            file = $('[name=profile]').prop("files")[0];
            blobURL = window.URL.createObjectURL(file);
            $('#image_preview img').attr('src', blobURL);
            $('#image_preview').slideDown(); //업로드한 이미지 미리보기 
          
        }
    })
    $('input[name=send]').click(function(){
        
        $('.validlabel').remove();
        let validate = true;
        $(".member input").each(function(index,input){
           if(validateInput($(input).attr('name'))== false){
                validate = false;
           }    
        })
        
       if(validate){   
            var profileFile =$('.member').find('input[name=profile]')[0].files[0];
            var savepath="";
            if(!!profileFile){
                let storageRef = storage.ref();
                let savePath = storageRef.child('profileImage/'+ $('[name=name]').val()+new Date().getTime()+"."+profileFile.name.split('.')[1]);
                let saveAction = savePath.put(profileFile);
                saveAction.then(()=>{
                    const ref = firebase.storage().ref(savePath.fullPath);
                    console.log(savePath.fullPath + "upload complete");
                }).catch((err)=>{
                    console.log(err);
                })
                savepath = savePath.fullPath;
            }   
            let userObject ={
                position:$('[name=position]').val(),
                name:$('[name=name]').val(),
                description:$('[name=description').val(),
                column1:$('[name=column1]').val(),
                column2:$('[name=column2]').val(),
                column3:$('[name=column3]').val(),
                hashtag:$('[name=hashtag]').val(),
                imgsrc:savepath
            }
            db.collection('userinfo').add(userObject).then((result) => {
                console.log(result);
            
                window.location.href = './team.html'
            }).catch((err)=>{
                console.log(err);
            })
        
       }
        
    })
    
}
else if(document.location.href.indexOf("team.html") >=0){
    const db = firebase.firestore();
    db.collection('userinfo').get().then((snapshot)=>{
      
        let i =0;
        snapshot.forEach((doc)=>{
            
            const ref = firebase.storage().ref(doc.data().imgsrc);
            ref.getDownloadURL().then(function(url) 
            {
              
                var template = `
                <section class="member" >
                <h3  class="ani">${doc.data().position}, ${doc.data().name}</h3>
                    <div style="display: flex;">
                        <img src="${url}" id='profileImage' alt="" class="ani">
                        <ul class="introduce ani">
                            <li>${doc.data().description}</li>
                            <li><h4>Favorite Words</h4>${doc.data().column1}</li>
                            <li><h4>Like</h4>${doc.data().column2}</li>
                            <li><h4>Hate</h4>${doc.data().column3}</li>
                        </ul>
                    </div>
                    <div class="hashtag ani">
                        ${doc.data().hashtag}
                    </div>            
                </section>`
                $('#content').append(template);
                if(i==0){
                    $('#content').find('.member').find('.ani').css({'opacity':'1','transform':'translateY(0)','margin-top':'0'});
                } 
                i++;

            }).catch(function(error) 
            {
               console.log(error);
            });
          

        })
        
    })


    function teamEditMode(){
      
        const db = firebase.firestore();
        db.collection('userinfo').get().then((snapshot)=>{
            $('.member').remove();
            let i =0;
            snapshot.forEach((doc)=>{
                
                const ref = firebase.storage().ref(doc.data().imgsrc);
                ref.getDownloadURL().then(function(url) 
                {
                
                    var template = `
                    <section class="member" id='${doc.id}'>
                        <div style="display: flex;">
                            <div id="image_preview">
                                <img src="${url}" id='profileImage' alt="사진영역"  ">
                            </div>
                            <ul class="introduce notani">
                                
                                <li><h4>Profile Picture</h4>
                                    <input class="required" type="file" value ='${doc.data().imgsrc}'
                                        name="profile" name="profile"
                                        accept="image/png, image/jpeg"></li>
                                <li><h4>Position</h4><input class="required" name="position" type='text' value='${doc.data().position}'></input></li>
                                <li><h4>Name</h4><input class="required" name="name"  type='text' value='${doc.data().name}'></input></li>
                                <li><h4>Brief Introduction</h4><textarea class="required" name="description" >${doc.data().description}</textarea></li>
                                <li><h4>Favorite Words</h4><input class="required" name="column1"  type='text'  value='${doc.data().column1}'></input></li>
                                <li><h4>Like</h4><input class="required" name="column2" type='text'  value='${doc.data().column2}'></input></li>
                                <li><h4>Hate</h4><input class="required" name="column3" type='text'  value='${doc.data().column3}'></input></li>
                                <li><h4>Hash Tag</h4><input class="required" name="hashtag"  type='text'  value='${doc.data().hashtag}'></input></li>
                                <div class='updateButtonGroup' >
                                <div style='width:82%'><input type="button"  style='width:100%' class='btn btn-primary mt-3' name='send' value="Update" onClick='updateProfile(this)' /></div>
                                <div><svg style=' cursor:pointer;' xmlns="http://www.w3.org/2000/svg" onclick=deleteProfile(this) width="35" height="35" fill="red" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                              </svg></div>
                                </div>
                            </ul>            
                        </div>     
                    </section>`
                    $('#content').append(template);
                    if(i==0){
                        $('#content').find('.member').find('.ani').css({'opacity':'1','transform':'translateY(0)','margin-top':'0'});
                    } 
                    i++;
                    $('#'+doc.id).find('input[name=profile]').change(function(){
                        ext = $(this).val().split('.').pop().toLowerCase(); //확장자
                        //배열에 추출한 확장자가 존재하는지 체크
                        if($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
                            resetFormElement($(this)); //폼 초기화
                            window.alert('Not Image! (only gif, png, jpg, jpeg)');
                        } else {
                            file = $(this).parents('.member').find('[name=profile]').prop("files")[0];
                            blobURL = window.URL.createObjectURL(file);
                            $(this).parents('.member').find('#image_preview img').attr('src', blobURL);
                            $(this).parents('.member').find('#image_preview').slideDown(); //업로드한 이미지 미리보기 
                        
                        }
                    })

                }).catch(function(error) 
                {
                console.log(error);
                });
            

            })
            
        })

        
     
    }

    function updateProfile(button){
        const db = firebase.firestore();
        const storage= firebase.storage();
        $(button).parents('ul').find('.validlabel').remove();
        var profileFile = $(button).parents('.member').find('input[name=profile]')[0].files[0];
        let validate = true;
        $(button).parents('ul').find("input").each(function(index,input){

            if(!!profileFile == false && $(input).attr('name')=='profile'){

            }else{
                if(validateInput($(input).attr('name'),$(button).parents('.member'))== false){
                    validate = false;
               }    
            }
           
        })
        
       if(validate){   
            let userObject ={
                position:$(button).parents('ul').find('[name=position]').val(),
                name:$(button).parents('ul').find('[name=name]').val(),
                description:$(button).parents('ul').find('[name=description]').val(),
                column1:$(button).parents('ul').find('[name=column1]').val(),
                column2:$(button).parents('ul').find('[name=column2]').val(),
                column3:$(button).parents('ul').find('[name=column3]').val(),
                hashtag:$(button).parents('ul').find('[name=hashtag]').val()               
            }
        
            
            if(!!profileFile){
                let storageRef = storage.ref();
                let savePath = storageRef.child('profileImage/'+ $(button).parents('ul').find('#name').val()+new Date().getTime()+"."+profileFile.name.split('.')[1]);
                let saveAction = savePath.put(profileFile);
                saveAction.then(()=>{
                    const ref = firebase.storage().ref(savePath.fullPath);
                    console.log(savePath.fullPath + "upload complete");
                }).catch((err)=>{
                    console.log(err);
                })
                userObject.imgsrc = savePath.fullPath;
            }
         
           
           

            let docId = $(button).parents('.member').attr('id');
            db.collection('userinfo').doc(docId).update(userObject);
            
        }
    }

    
    function deleteProfile(dom){
        let firebaseId = $(dom).parents('.member').attr('id');
    
        if(confirm('Are you sure you want to delete this?') == true){
        const db = firebase.firestore();
        db.collection('userinfo').doc(firebaseId).delete().then(() => {
            $(dom).parents('.member').remove();
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
        }
        
    }
}
