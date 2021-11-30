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

function validateInput(id){
    let x = document.getElementById(id).value;   
    let text;
    if (x.trim() == "") {
        let p = document.createElement("p");
        p.className  = "validlabel";
        p.innerHTML = "This field is required";
        document.getElementById(id).after(p);
    } else {
      text = "";
    }
    
 
    if(text == "") return true;
    else return false;
}


if(document.location.href.indexOf("userinfo_upload.html")>=0){
    const db = firebase.firestore();
    const storage= firebase.storage();

    $('#profile').change(function(){
        ext = $(this).val().split('.').pop().toLowerCase(); //확장자
        //배열에 추출한 확장자가 존재하는지 체크
        if($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
            resetFormElement($(this)); //폼 초기화
            window.alert('이미지 파일이 아닙니다! (gif, png, jpg, jpeg 만 업로드 가능)');
        } else {
            file = $('#profile').prop("files")[0];
            blobURL = window.URL.createObjectURL(file);
            $('#image_preview img').attr('src', blobURL);
            $('#image_preview').slideDown(); //업로드한 이미지 미리보기 
          
        }
    })
    $('#send').click(function(){
        
        $('.validlabel').remove();
        let validate = true;
        $(".member input").each(function(index,input){
           if(validateInput($(input).attr('id'))== false){
                validate = false;
           }    
        })
        
       if(validate){   
            var profileFile = document.querySelector('#profile').files[0];
            let storageRef = storage.ref();
            let savePath = storageRef.child('profileImage/'+ $('#position').val()+new Date().getTime()+"."+profileFile.name.split('.')[1]);
            let saveAction = savePath.put(profileFile);
            saveAction.then(()=>{
                const ref = firebase.storage().ref(savePath.fullPath);
                console.log(savePath.fullPath + "upload complete");
            }).catch((err)=>{
                console.log(err);
            })
            let userObject ={
                position:$('#position').val(),
                name:$('#name').val(),
                description:$('#description').val(),
                column1:$('#column1').val(),
                column2:$('#column2').val(),
                column3:$('#column3').val(),
                hashtag:$('#hashtag').val(),
                imgsrc:savePath.fullPath
            }
            db.collection('userinfo').add(userObject).then((result) => {
                console.log(result);
            
                window.location.href = '../team.html'
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
                    $('#content').find('.member').find('.ani').css({'opacity':'1','transform':'translateY(0)'});
                } 
                i++;

            }).catch(function(error) 
            {
               console.log(error);
            });
          

        })
        
    })
}
