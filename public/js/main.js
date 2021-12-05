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


if(document.location.href.indexOf("team_add.html")>=0){
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
                let savePath = storageRef.child('profileImage/'+ $('#name').val()+new Date().getTime()+"."+profileFile.name.split('.')[1]);
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
                <section class="member">
                <h3  class="ani">${doc.data().position}, ${doc.data().name}</h3>
                    <div>
                        <img src="${url}" id='profileImage' alt="" class="ani">
                        <ul class="introduce ani">
                            <li>${doc.data().description}</li>
                            <li><h4>자주하는 말</h4>${doc.data().column1}</li>
                            <li><h4>좋우리는 것</h4>${doc.data().column2}</li>
                            <li><h4>싫어하는 것</h4>${doc.data().column3}</li>
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
                        <div>
                            <div id="image_preview">
                                <img src="${url}" id='profileImage' alt="사진영역"  ">
                            </div>
                            <ul class="introduce notani">
                                
                                <li><h4>프로필 사진</h4>
                                    <input class="required" type="file" value ='${doc.data().imgsrc}'
                                        name="profile" name="profile"
                                        accept="image/png, image/jpeg"></li>
                                <li><h4>포지션</h4><input class="required" name="position" type='text' value='${doc.data().position}'></input></li>
                                <li><h4>이름</h4><input class="required" name="name"  type='text' value='${doc.data().name}'></input></li>
                                <li><h4>간단한 소개</h4><textarea style='width:100%;'class="required" name="description" >${doc.data().description}</textarea></li>
                                <li><h4>자주하는 말</h4><input class="required" name="column1"  type='text'  value='${doc.data().column1}'></input></li>
                                <li><h4>좋아하는 것</h4><input class="required" name="column2" type='text'  value='${doc.data().column2}'></input></li>
                                <li><h4>싫어하는 것</h4><input class="required" name="column3" type='text'  value='${doc.data().column3}'></input></li>
                                <li><h4>해쉬 태그</h4><input class="required" name="hashtag"  type='text'  value='${doc.data().hashtag}'></input></li>
                                <li><input type="button"  class='btn btn-primary mt-3' name='send' value="업데이트" onClick='updateProfile(this)' /></li>
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
                            window.alert('이미지 파일이 아닙니다! (gif, png, jpg, jpeg 만 업로드 가능)');
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
}
